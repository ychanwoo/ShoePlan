from io import BytesIO
import os
from pathlib import Path
from typing import Optional

import numpy as np
import onnxruntime as ort
from fastapi import FastAPI, File, HTTPException, UploadFile
from PIL import Image, ImageOps


INPUT_SIZE = 768
MAX_DETECTIONS = 300
NMS_IOU_THRESHOLD = 0.5
CANDIDATE_CONFIDENCE = 0.15
RESULT_CONFIDENCE = 0.3
MODEL_CLASSES = ["inside", "insufficient", "neutral", "outside"]
MODEL_PATH = Path(os.getenv("MODEL_PATH", "models/best.onnx"))
if not MODEL_PATH.exists():
    repo_model_path = Path(__file__).resolve().parent.parent / "models" / "best.onnx"
    if repo_model_path.exists():
        MODEL_PATH = repo_model_path

app = FastAPI(title="ShoePlan Outsole Model API")
session: Optional[ort.InferenceSession] = None


def get_session() -> ort.InferenceSession:
    global session

    if session is None:
        if not MODEL_PATH.exists():
            raise RuntimeError(f"Outsole ONNX model not found: {MODEL_PATH}")

        session = ort.InferenceSession(str(MODEL_PATH), providers=["CPUExecutionProvider"])

    return session


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    image = Image.open(BytesIO(image_bytes))
    image = ImageOps.exif_transpose(image).convert("RGB")
    image.thumbnail((INPUT_SIZE, INPUT_SIZE), Image.Resampling.LANCZOS)

    canvas = Image.new("RGB", (INPUT_SIZE, INPUT_SIZE), (255, 255, 255))
    offset = ((INPUT_SIZE - image.width) // 2, (INPUT_SIZE - image.height) // 2)
    canvas.paste(image, offset)

    array = np.asarray(canvas, dtype=np.float32) / 255.0
    array = np.transpose(array, (2, 0, 1))
    return np.expand_dims(array, axis=0)


def intersection_over_union(a: dict, b: dict) -> float:
    inter_x1 = max(a["x1"], b["x1"])
    inter_y1 = max(a["y1"], b["y1"])
    inter_x2 = min(a["x2"], b["x2"])
    inter_y2 = min(a["y2"], b["y2"])
    inter_width = max(0.0, inter_x2 - inter_x1)
    inter_height = max(0.0, inter_y2 - inter_y1)
    inter_area = inter_width * inter_height
    area_a = max(0.0, a["x2"] - a["x1"]) * max(0.0, a["y2"] - a["y1"])
    area_b = max(0.0, b["x2"] - b["x1"]) * max(0.0, b["y2"] - b["y1"])
    union = area_a + area_b - inter_area

    return inter_area / union if union > 0 else 0.0


def nms(detections: list[dict]) -> list[dict]:
    selected: list[dict] = []

    for detection in sorted(detections, key=lambda item: item["score"], reverse=True):
        overlaps_existing = any(
            intersection_over_union(item, detection) > NMS_IOU_THRESHOLD
            for item in selected
        )

        if not overlaps_existing:
            selected.append(detection)

    return selected


def parse_detections(output: np.ndarray) -> list[dict]:
    output = np.squeeze(output)

    if output.ndim != 2 or output.shape[1] != 6 or output.shape[0] > MAX_DETECTIONS:
        raise RuntimeError(f"Unexpected outsole model output shape: {output.shape}")

    detections: list[dict] = []

    for row in output:
        score = float(row[4])
        class_id = int(round(float(row[5])))

        if not np.isfinite(score) or score < CANDIDATE_CONFIDENCE:
            continue

        class_name = MODEL_CLASSES[class_id] if 0 <= class_id < len(MODEL_CLASSES) else "unknown"
        detections.append(
            {
                "x1": float(row[0]),
                "y1": float(row[1]),
                "x2": float(row[2]),
                "y2": float(row[3]),
                "score": score,
                "className": class_name,
            }
        )

    return nms(detections)


def to_result(detection: Optional[dict]) -> dict:
    if detection is None or detection["score"] < RESULT_CONFIDENCE:
        return {"className": "unknown", "confidence": None}

    return {
        "className": detection["className"],
        "confidence": round(float(detection["score"]), 3),
    }


@app.get("/health")
def health() -> dict:
    return {"ok": True, "modelExists": MODEL_PATH.exists()}


@app.post("/predict")
async def predict(image: UploadFile = File(...)) -> dict:
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Image file is required.")

    try:
        image_bytes = await image.read()
        input_tensor = preprocess_image(image_bytes)
        model = get_session()
        input_name = model.get_inputs()[0].name
        output_name = model.get_outputs()[0].name
        output = model.run([output_name], {input_name: input_tensor})[0]
        detections = parse_detections(output)
        best_detection = detections[0] if detections else None
        return to_result(best_detection)
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error)) from error
