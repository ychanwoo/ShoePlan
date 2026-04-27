"use client";

import HeaderBar from "@/components/common/HeaderBar";
import Loading from "@/components/common/Loading";
import TabBar from "@/components/common/TabBar";
import { calculateShoeLife, SessionShoeData } from "@/utils/calculateShoeLife";
import {
  CheckCircle2,
  ImagePlus,
  LoaderCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

interface UserProfileRow {
  height: number | null;
  weight: number | null;
  running_distance: string | null;
  running_distance_custom: string | number | null;
  running_type: string | null;
  running_place: string | null;
  shoe_age: string | null;
  shoe_brand: string | null;
  shoe_model: string | null;
  accumulated_distance: number | null;
  is_running: boolean | null;
  created_at?: string;
  updated_at?: string;
}

interface ApiMeResponse {
  profile: UserProfileRow | null;
}

interface OutsoleAnalysis {
  id: string;
  dominantWearSide: "inside" | "outside" | "balanced";
  wearSeverity: "low" | "medium" | "high";
  summary: string;
  recommendation: string;
  imageUrl: string | null;
}

const HISTORY_KEY = "shoeplan:outsole-history";
const LATEST_RESULT_KEY = "shoeplan:outsole-latest-result";

function resolveShoeLifeInput(profile: UserProfileRow): SessionShoeData | null {
  if (!profile.shoe_brand || !profile.shoe_model) return null;

  return {
    height: Number(profile.height ?? 0),
    weight: Number(profile.weight ?? 0),
    runningDistance: profile.running_distance ?? "",
    runningDistanceCustom:
      profile.running_distance_custom === null ||
      profile.running_distance_custom === undefined
        ? undefined
        : String(profile.running_distance_custom),
    runningType: profile.running_type ?? "",
    shoeAge: profile.shoe_age ?? "",
    shoeBrand: profile.shoe_brand,
    shoeModel: profile.shoe_model,
    updatedAt: profile.updated_at ?? profile.created_at,
    accumulatedDistance: profile.accumulated_distance ?? 0,
    isRunning: profile.is_running ?? true,
  };
}

function createAnalysis(
  profile: UserProfileRow | null,
  imageUrl: string | null,
): OutsoleAnalysis {
  const shoeLifeInput = profile ? resolveShoeLifeInput(profile) : null;
  const shoeLife = shoeLifeInput ? calculateShoeLife(shoeLifeInput) : null;
  const usagePercent = shoeLife?.usagePercent ?? 0;
  const dominantWearSide = profile?.running_place?.startsWith("Track")
    ? "inside"
    : profile?.running_place?.startsWith("Road")
      ? "outside"
      : "balanced";
  const wearSeverity =
    usagePercent >= 70 ? "high" : usagePercent >= 35 ? "medium" : "low";

  return {
    id: `${Date.now()}`,
    dominantWearSide,
    wearSeverity,
    imageUrl,
    summary:
      wearSeverity === "high"
        ? "누적 주행 거리와 현재 프로필 기준으로 마모가 꽤 진행된 상태로 추정됩니다."
        : wearSeverity === "medium"
          ? "즉시 교체 단계는 아니지만, 패턴 마모를 주기적으로 확인해보는 편이 좋습니다."
          : "현재 저장된 러닝화 수명 정보 기준으로는 급격한 마모 징후가 크지 않은 편입니다.",
    recommendation:
      wearSeverity === "high"
        ? "실제 아웃솔 사진을 밝은 곳에서 한 번 더 촬영해 비교하고, 교체 시기를 함께 검토해보세요."
        : "같은 각도에서 주기적으로 촬영해 변화량을 비교하면 더 정확한 교체 타이밍을 잡을 수 있습니다.",
  };
}

export default function OutsolePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileRow | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [analyses, setAnalyses] = useState<OutsoleAnalysis[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const hasShoeData = useMemo(
    () => Boolean(profile?.shoe_brand && profile?.shoe_model),
    [profile?.shoe_brand, profile?.shoe_model],
  );
  const latest = analyses[0];

  useEffect(() => {
    const loadPageData = async () => {
      setIsLoading(true);

      try {
        const response = await fetch("/api/me");
        const data = (await response.json()) as ApiMeResponse;
        setProfile(data.profile);

        const saved = window.localStorage.getItem(HISTORY_KEY);
        if (saved) {
          setAnalyses(JSON.parse(saved) as OutsoleAnalysis[]);
        }
      } catch (error) {
        console.error("Outsole data load error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPageData();
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setMessage("");
    event.target.value = "";

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!imageUrl) {
      setMessage("먼저 아웃솔 이미지를 업로드해주세요.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    window.setTimeout(() => {
      const result = createAnalysis(profile, imageUrl);
      const next = [result, ...analyses].slice(0, 12);
      setAnalyses(next);
      window.sessionStorage.setItem(LATEST_RESULT_KEY, JSON.stringify(result));
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      router.push("/shoe/outsole/result");
    }, 3000);
  };

  const resetImage = () => {
    setImageUrl(null);
    setFileName("");
    setMessage("");
  };

  if (isLoading) return <Loading />;

  if (submitting) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#2F3941] text-[#CBD5E1]">
        <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#1E7F4F] border-t-transparent" />
        <p className="animate-pulse">아웃솔 마모 패턴을 분석 중입니다...</p>
      </div>
    );
  }

  return (
    <>
      <HeaderBar title="Outsole" />

      <div className="h-[calc(100vh-11vh)] overflow-y-auto px-5 pt-5 pb-32">
        <div className="mx-auto flex w-full max-w-92.5 flex-col gap-4">
          <section className="rounded-2xl bg-[#242E35] p-4 text-[#CBD5E1] shadow-lg">
            <p className="text-xs text-[#94A3B8]">Outsole Check</p>
            <h1 className="mt-2 text-lg font-bold text-white">
              아웃솔 사진으로 마모 패턴 확인
            </h1>
            <div className="mt-4 flex flex-col gap-3 text-sm leading-6">
              <div className="flex gap-2">
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-[#1E7F4F]"
                  size={16}
                />
                <p>뒤꿈치와 전족부가 한 화면에 들어오게 촬영해주세요.</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-[#1E7F4F]"
                  size={16}
                />
                <p>밝은 곳에서 신발 바닥을 최대한 평평하게 맞추면 좋아요.</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-[#1E7F4F]"
                  size={16}
                />
                <p>
                  {hasShoeData
                    ? "저장된 러닝 데이터와 함께 기본 분석을 진행합니다."
                    : "러닝화 정보를 등록하면 분석 결과가 더 자연스럽게 연결됩니다."}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-[#242E35] p-4 text-[#CBD5E1] shadow-lg">
            <div className="flex min-h-60 items-center justify-center overflow-hidden rounded-2xl bg-[#1B242C]">
              {imageUrl ? (
                // Data URL preview is user-selected local media, so a plain image tag is the most reliable render path here.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt="선택한 아웃솔 이미지"
                  className="h-60 w-full object-cover"
                  src={imageUrl}
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-center text-[#94A3B8]">
                  <ImagePlus size={34} strokeWidth={1.6} />
                  <p className="text-sm">아웃솔 사진을 추가해주세요</p>
                </div>
              )}
            </div>

            {fileName ? (
              <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#94A3B8]">
                <span className="min-w-0 truncate">{fileName}</span>
                <button
                  aria-label="이미지 다시 선택"
                  className="shrink-0 text-[#CBD5E1] transition hover:text-white"
                  onClick={resetImage}
                  type="button"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            ) : null}

            <label className="mt-4 flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-[#1E7F4F] px-3 text-sm font-semibold text-white transition active:scale-[0.98]">
              <ImagePlus size={17} />
              사진 업로드
              <input
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                type="file"
              />
            </label>

            <p className="mt-4 text-sm leading-6 text-[#CBD5E1]">
              뒤꿈치와 전족부가 모두 보이도록 정면에서 촬영하면 비교가 더
              쉬워집니다.
            </p>
          </section>

          <button
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-[#1E7F4F] px-4 font-semibold text-white shadow-lg transition disabled:opacity-70 active:scale-[0.98]"
            disabled={submitting}
            onClick={analyze}
            type="button"
          >
            {submitting ? (
              <LoaderCircle className="animate-spin" size={18} />
            ) : (
              <Sparkles size={18} />
            )}
            {submitting ? "분석 중..." : "분석 실행"}
          </button>

          {message ? (
            <p className="text-center text-sm font-medium text-[#CBD5E1]">
              {message}
            </p>
          ) : null}

          {latest ? (
            <p className="text-center text-xs text-[#94A3B8]">
              이전 분석 결과는 Result 화면에서 다시 확인할 수 있습니다.
            </p>
          ) : null}
        </div>
      </div>

      <TabBar />
    </>
  );
}
