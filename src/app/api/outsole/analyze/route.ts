import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { OutsoleAnalysisResult } from "@/lib/outsoleAnalysis";

export const runtime = "nodejs";
export const maxDuration = 60;

const BUCKET_NAME = "outsole-images";
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function sanitizePathPart(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function getExtension(fileName: string, contentType: string) {
  const fromName = fileName.split(".").pop()?.toLowerCase();
  if (fromName && fromName.length <= 5) return fromName;

  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";

  return "jpg";
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const oauthId = cookieStore.get("oauthId")?.value;

    if (!oauthId) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const leftImage = formData.get("leftImage");
    const rightImage = formData.get("rightImage");

    if (!(leftImage instanceof File) || !(rightImage instanceof File)) {
      return NextResponse.json(
        { error: "왼쪽과 오른쪽 아웃솔 이미지를 모두 업로드해주세요." },
        { status: 400 },
      );
    }

    if (leftImage.size > MAX_IMAGE_BYTES || rightImage.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "각 이미지는 10MB 이하로 업로드해주세요." },
        { status: 400 },
      );
    }

    const leftImageBuffer = Buffer.from(await leftImage.arrayBuffer());
    const rightImageBuffer = Buffer.from(await rightImage.arrayBuffer());
    const { analyzeOutsoleImage } = await import("@/lib/outsoleModel");
    const [left, right] = await Promise.all([
      analyzeOutsoleImage(leftImageBuffer),
      analyzeOutsoleImage(rightImageBuffer),
    ]);
    const updatedAt = new Date().toISOString();
    const safeOauthId = sanitizePathPart(oauthId);
    const leftStoragePath = `${safeOauthId}/left-outsole-${Date.now()}.${getExtension(leftImage.name, leftImage.type)}`;
    const rightStoragePath = `${safeOauthId}/right-outsole-${Date.now()}.${getExtension(rightImage.name, rightImage.type)}`;

    const [leftUpload, rightUpload] = await Promise.all([
      supabase.storage.from(BUCKET_NAME).upload(leftStoragePath, leftImageBuffer, {
        contentType: leftImage.type || "image/jpeg",
        upsert: true,
      }),
      supabase.storage
        .from(BUCKET_NAME)
        .upload(rightStoragePath, rightImageBuffer, {
          contentType: rightImage.type || "image/jpeg",
          upsert: true,
        }),
    ]);

    if (leftUpload.error || rightUpload.error) {
      console.error("Outsole image upload error:", {
        left: leftUpload.error,
        right: rightUpload.error,
      });
      return NextResponse.json(
        { error: "이미지 저장에 실패했습니다." },
        { status: 500 },
      );
    }

    const { data: leftPublicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(leftStoragePath);
    const { data: rightPublicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(rightStoragePath);

    const result: OutsoleAnalysisResult = {
      leftImageUrl: leftPublicUrlData.publicUrl,
      rightImageUrl: rightPublicUrlData.publicUrl,
      left,
      right,
      updatedAt,
    };

    const { error: upsertError } = await supabase
      .from("outsole_analysis")
      .upsert(
        {
          oauth_id: oauthId,
          left_image_url: result.leftImageUrl,
          right_image_url: result.rightImageUrl,
          left_class: result.left.className,
          left_confidence: result.left.confidence,
          right_class: result.right.className,
          right_confidence: result.right.confidence,
          updated_at: updatedAt,
        },
        { onConflict: "oauth_id" },
      );

    if (upsertError) {
      console.error("Outsole analysis upsert error:", upsertError);
      return NextResponse.json(
        { error: "분석 결과 저장에 실패했습니다." },
        { status: 500 },
      );
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Outsole analyze error:", error);
    return NextResponse.json(
      { error: "분석을 완료하지 못했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }
}
