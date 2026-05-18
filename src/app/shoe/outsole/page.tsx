"use client";

import HeaderBar from "@/components/common/HeaderBar";
import Loading from "@/components/common/Loading";
import TabBar from "@/components/common/TabBar";
import { OutsoleAnalysisResult } from "@/lib/outsoleAnalysis";
import {
  CheckCircle2,
  ImagePlus,
  Lightbulb,
  LoaderCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

interface UserProfileRow {
  shoe_brand: string | null;
  shoe_model: string | null;
}

interface ApiMeResponse {
  profile: UserProfileRow | null;
}

interface AnalyzeResponse {
  result?: OutsoleAnalysisResult;
  error?: string;
}

type FootSide = "left" | "right";

interface UploadState {
  file: File | null;
  fileName: string;
  previewUrl: string | null;
}

const LATEST_RESULT_KEY = "shoeplan:outsole-latest-result";
const MIN_LOADING_MS = 3000;

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function emptyUpload(): UploadState {
  return {
    file: null,
    fileName: "",
    previewUrl: null,
  };
}

function revokePreview(upload: UploadState) {
  if (upload.previewUrl?.startsWith("blob:")) {
    URL.revokeObjectURL(upload.previewUrl);
  }
}

export default function OutsolePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileRow | null>(null);
  const [leftUpload, setLeftUpload] = useState<UploadState>(emptyUpload);
  const [rightUpload, setRightUpload] = useState<UploadState>(emptyUpload);
  const leftUploadRef = useRef<UploadState>(emptyUpload());
  const rightUploadRef = useRef<UploadState>(emptyUpload());
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const hasShoeData = useMemo(
    () => Boolean(profile?.shoe_brand && profile?.shoe_model),
    [profile?.shoe_brand, profile?.shoe_model],
  );

  useEffect(() => {
    const loadPageData = async () => {
      setIsLoading(true);

      try {
        const response = await fetch("/api/me");
        const data = (await response.json()) as ApiMeResponse;
        setProfile(data.profile);
      } catch (error) {
        console.error("Outsole data load error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPageData();
  }, []);

  useEffect(() => {
    leftUploadRef.current = leftUpload;
    rightUploadRef.current = rightUpload;
  }, [leftUpload, rightUpload]);

  useEffect(() => {
    return () => {
      revokePreview(leftUploadRef.current);
      revokePreview(rightUploadRef.current);
    };
  }, []);

  const updateUpload = (side: FootSide, file: File) => {
    const setter = side === "left" ? setLeftUpload : setRightUpload;

    setter((prev) => {
      revokePreview(prev);
      return {
        file,
        fileName: file.name,
        previewUrl: URL.createObjectURL(file),
      };
    });
  };

  const handleFileChange =
    (side: FootSide) => (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      updateUpload(side, file);
      setMessage("");
      event.target.value = "";
    };

  const resetUpload = (side: FootSide) => {
    const setter = side === "left" ? setLeftUpload : setRightUpload;

    setter((prev) => {
      revokePreview(prev);
      return emptyUpload();
    });
    setMessage("");
  };

  const swapUploads = () => {
    setLeftUpload(rightUpload);
    setRightUpload(leftUpload);
    setMessage("");
  };

  const analyze = async () => {
    if (!leftUpload.file || !rightUpload.file) {
      setMessage("왼쪽과 오른쪽 아웃솔 사진을 모두 업로드해주세요.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    const minimumLoading = delay(MIN_LOADING_MS);

    try {
      const formData = new FormData();
      formData.append("leftImage", leftUpload.file);
      formData.append("rightImage", rightUpload.file);

      const response = await fetch("/api/outsole/analyze", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as AnalyzeResponse;
      await minimumLoading;

      if (!response.ok || !data.result) {
        throw new Error(
          data.error ??
            "분석을 완료하지 못했습니다. 잠시 후 다시 시도해주세요.",
        );
      }

      window.sessionStorage.setItem(
        LATEST_RESULT_KEY,
        JSON.stringify(data.result),
      );
      window.localStorage.setItem(
        LATEST_RESULT_KEY,
        JSON.stringify(data.result),
      );
      router.push("/shoe/outsole/result");
    } catch (error) {
      await minimumLoading;
      console.error("Outsole analyze request error:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "분석을 완료하지 못했습니다. 잠시 후 다시 시도해주세요.",
      );
      setSubmitting(false);
    }
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

  const canAnalyze = Boolean(leftUpload.file && rightUpload.file);

  return (
    <>
      <HeaderBar title="Outsole" />

      <div className="h-[calc(100vh-11vh)] overflow-y-auto px-5 pt-5 pb-32">
        <div className="mx-auto flex w-full max-w-92.5 flex-col gap-4">
          <section className="rounded-2xl bg-[#242E35] p-4 text-[#CBD5E1] shadow-lg">
            <p className="text-xs text-[#94A3B8]">Outsole Check</p>
            <h1 className="mt-2 text-lg font-bold text-white">
              좌우 아웃솔을 정밀 분석해요
            </h1>
            <div className="mt-4 flex flex-col gap-2 text-sm leading-5">
              <div className="flex items-start gap-2">
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-[#1E7F4F]"
                  size={16}
                />
                <p>더 면밀한 분석을 위해 왼발과 오른발을 각각 확인해요.</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-[#1E7F4F]"
                  size={16}
                />
                <p>좌우를 바꿔 올리면 결과가 다르게 보일 수 있어요.</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-[#1E7F4F]"
                  size={16}
                />
                <p>
                  {hasShoeData
                    ? "분석 결과를 바탕으로 더 안전한 러닝을 도와드릴게요."
                    : "결과를 통해 더 안전한 러닝 습관을 확인할 수 있어요."}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#60A5FA]/25 bg-[#1D2E3A] p-4 text-[#CBD5E1] shadow-lg shadow-black/10">
            <div className="flex gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#60A5FA]/15 text-[#60A5FA]">
                <Lightbulb size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">깨알 지식</p>
                <p className="mt-2 text-sm leading-6 text-[#D8E6F3]">
                  많은 러너가 착지 초기에 뒤꿈치 바깥쪽부터 닿습니다. 바깥쪽
                  마모는 자연스러운 착지 과정일 수 있습니다.
                </p>
              </div>
            </div>
          </section>

          <UploadCard
            label="왼쪽 신발"
            onChange={handleFileChange("left")}
            onReset={() => resetUpload("left")}
            upload={leftUpload}
          />
          <UploadCard
            label="오른쪽 신발"
            onChange={handleFileChange("right")}
            onReset={() => resetUpload("right")}
            upload={rightUpload}
          />

          <button
            className="flex min-h-10 w-full items-center justify-center gap-2 rounded-[14px] border border-white/10 bg-[#27323A] px-4 text-sm font-semibold text-[#CBD5E1] transition disabled:opacity-40 active:scale-[0.98]"
            disabled={!leftUpload.file || !rightUpload.file}
            onClick={swapUploads}
            type="button"
          >
            <RotateCcw size={16} />
            왼쪽/오른쪽 이미지 바꾸기
          </button>

          <button
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-[#1E7F4F] px-4 font-semibold text-white shadow-lg transition disabled:opacity-60 active:scale-[0.98]"
            disabled={submitting || !canAnalyze}
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

          {!canAnalyze ? (
            <p className="text-center text-xs text-[#94A3B8]">
              정확한 비교를 위해 두 장 모두 업로드해야 분석할 수 있어요.
            </p>
          ) : null}

          {message ? (
            <p className="text-center text-sm font-medium text-[#CBD5E1]">
              {message}
            </p>
          ) : null}
        </div>
      </div>

      <TabBar />
    </>
  );
}

function UploadCard({
  label,
  onChange,
  onReset,
  upload,
}: {
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  upload: UploadState;
}) {
  return (
    <section className="rounded-2xl bg-[#242E35] p-4 text-[#CBD5E1] shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-[#94A3B8]">Required</p>
          <h2 className="mt-1 text-base font-bold text-white">{label}</h2>
        </div>
        {upload.file ? (
          <button
            aria-label={`${label} 이미지 다시 선택`}
            className="text-[#CBD5E1] transition hover:text-white"
            onClick={onReset}
            type="button"
          >
            <RotateCcw size={16} />
          </button>
        ) : null}
      </div>

      <div className="flex min-h-52 items-center justify-center overflow-hidden rounded-2xl bg-[#1B242C]">
        {upload.previewUrl ? (
          // User-selected local media preview.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={`${label} 아웃솔 이미지`}
            className="h-52 w-full object-cover"
            src={upload.previewUrl}
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-center text-[#94A3B8]">
            <ImagePlus size={32} strokeWidth={1.6} />
            <p className="text-sm">{label} 밑창 사진을 추가해주세요</p>
          </div>
        )}
      </div>

      {upload.fileName ? (
        <p className="mt-3 truncate text-xs text-[#94A3B8]">
          {upload.fileName}
        </p>
      ) : null}

      <label className="mt-4 flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-[#1E7F4F]/50 bg-[#1E7F4F]/10 px-3 text-sm font-semibold text-[#9DE7BF] transition hover:bg-[#1E7F4F]/16 active:scale-[0.98]">
        <ImagePlus size={17} />
        {label} 업로드
        <input
          accept="image/*"
          className="hidden"
          onChange={onChange}
          type="file"
        />
      </label>
    </section>
  );
}
