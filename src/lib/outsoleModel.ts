import { existsSync } from "fs";
import path from "path";
import * as ort from "onnxruntime-node";
import sharp from "sharp";
import {
  FootAnalysisResult,
  OutsoleClass,
} from "@/lib/outsoleAnalysis";

const INPUT_SIZE = 768;
const MAX_DETECTIONS = 300;
const NMS_IOU_THRESHOLD = 0.5;
const CANDIDATE_CONFIDENCE = 0.15;
const RESULT_CONFIDENCE = 0.3;
const MODEL_CLASSES: OutsoleClass[] = [
  "inside",
  "insufficient",
  "neutral",
  "outside",
];

interface Detection {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  score: number;
  className: OutsoleClass;
}

let sessionPromise: Promise<ort.InferenceSession> | null = null;

function getModelPath() {
  return (
    process.env.SHOEPLAN_ONNX_MODEL_PATH ??
    path.join(process.cwd(), "models", "best.onnx")
  );
}

function loadSession() {
  if (!sessionPromise) {
    const modelPath = getModelPath();

    if (!existsSync(modelPath)) {
      throw new Error(`Outsole ONNX model not found: ${modelPath}`);
    }

    sessionPromise = ort.InferenceSession.create(modelPath);
  }

  return sessionPromise;
}

async function preprocessImage(imageBuffer: Buffer) {
  const resized = await sharp(imageBuffer)
    .rotate()
    .flatten({ background: "#ffffff" })
    .resize(INPUT_SIZE, INPUT_SIZE, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255 },
    })
    .removeAlpha()
    .raw()
    .toBuffer();

  const input = new Float32Array(3 * INPUT_SIZE * INPUT_SIZE);
  const pixelCount = INPUT_SIZE * INPUT_SIZE;

  for (let i = 0; i < pixelCount; i += 1) {
    input[i] = resized[i * 3] / 255;
    input[pixelCount + i] = resized[i * 3 + 1] / 255;
    input[pixelCount * 2 + i] = resized[i * 3 + 2] / 255;
  }

  return new ort.Tensor("float32", input, [
    1,
    3,
    INPUT_SIZE,
    INPUT_SIZE,
  ]);
}

function intersectionOverUnion(a: Detection, b: Detection) {
  const interX1 = Math.max(a.x1, b.x1);
  const interY1 = Math.max(a.y1, b.y1);
  const interX2 = Math.min(a.x2, b.x2);
  const interY2 = Math.min(a.y2, b.y2);
  const interWidth = Math.max(0, interX2 - interX1);
  const interHeight = Math.max(0, interY2 - interY1);
  const interArea = interWidth * interHeight;
  const areaA = Math.max(0, a.x2 - a.x1) * Math.max(0, a.y2 - a.y1);
  const areaB = Math.max(0, b.x2 - b.x1) * Math.max(0, b.y2 - b.y1);
  const union = areaA + areaB - interArea;

  return union > 0 ? interArea / union : 0;
}

function nms(detections: Detection[]) {
  const sorted = [...detections].sort((a, b) => b.score - a.score);
  const selected: Detection[] = [];

  for (const detection of sorted) {
    const overlapsExisting = selected.some(
      (item) => intersectionOverUnion(item, detection) > NMS_IOU_THRESHOLD,
    );

    if (!overlapsExisting) {
      selected.push(detection);
    }
  }

  return selected;
}

function parseDetections(output: ort.Tensor) {
  const [batch, rows, columns] = output.dims;
  const data = output.data as Float32Array;

  if (batch !== 1 || columns !== 6 || rows > MAX_DETECTIONS) {
    throw new Error(`Unexpected outsole model output shape: ${output.dims}`);
  }

  const detections: Detection[] = [];

  for (let row = 0; row < rows; row += 1) {
    const offset = row * columns;
    const score = Number(data[offset + 4]);
    const classId = Math.round(Number(data[offset + 5]));
    const className = MODEL_CLASSES[classId] ?? "unknown";

    if (!Number.isFinite(score) || score < CANDIDATE_CONFIDENCE) continue;

    detections.push({
      x1: Number(data[offset]),
      y1: Number(data[offset + 1]),
      x2: Number(data[offset + 2]),
      y2: Number(data[offset + 3]),
      score,
      className,
    });
  }

  return nms(detections);
}

function toFootResult(detection?: Detection): FootAnalysisResult {
  if (!detection || detection.score < RESULT_CONFIDENCE) {
    return { className: "unknown", confidence: null };
  }

  return {
    className: detection.className,
    confidence: Number(detection.score.toFixed(3)),
  };
}

async function runDetections(
  session: ort.InferenceSession,
  imageBuffer: Buffer,
) {
  const inputTensor = await preprocessImage(imageBuffer);
  const outputMap = await session.run({ images: inputTensor });
  const output = outputMap.output0;

  if (!output) {
    throw new Error("Outsole model did not return output0");
  }

  return parseDetections(output);
}

export async function analyzeOutsoleImage(
  imageBuffer: Buffer,
): Promise<FootAnalysisResult> {
  const session = await loadSession();
  const detections = await runDetections(session, imageBuffer);

  return toFootResult(detections.sort((a, b) => b.score - a.score)[0]);
}
