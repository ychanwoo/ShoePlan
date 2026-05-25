"use client";

import HeaderBar from "@/components/common/HeaderBar";
import TabBar from "@/components/common/TabBar";
import {
  FootAnalysisResult,
  OUTSOLE_CLASS_LABEL,
  OUTSOLE_RESULT_COPY,
  OutsoleAnalysisResult,
} from "@/lib/outsoleAnalysis";
import { KakaoShareParams } from "@/types/kakaoShareParams";
import { AlertTriangle, House, Share, Sparkles } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";

const LATEST_RESULT_KEY = "shoeplan:outsole-latest-result";

declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (params: KakaoShareParams) => void;
      };
    };
  }
}

function formatConfidence(confidence: number | null) {
  if (confidence === null) return "확인 필요";

  return `${Math.round(confidence * 100)}%`;
}

function FootResultCard({
  imageUrl,
  result,
  title,
}: {
  imageUrl: string | null;
  result: FootAnalysisResult;
  title: string;
}) {
  const copy = OUTSOLE_RESULT_COPY[result.className];

  return (
    <section className="rounded-2xl bg-[#242E35] p-4 shadow-lg">
      {imageUrl ? (
        <div className="mb-4 overflow-hidden rounded-2xl bg-[#1B242C]">
          {/* Uploaded outsole image from Supabase Storage. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={`${title} 아웃솔 이미지`}
            className="h-52 w-full object-cover"
            src={imageUrl}
          />
        </div>
      ) : null}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-[#94A3B8]">{title}</p>
          <h2 className="mt-2 text-lg font-bold text-white">
            {OUTSOLE_CLASS_LABEL[result.className]}
          </h2>
        </div>
        <div className="rounded-2xl bg-[#1B242C] px-3 py-2 text-right">
          <p className="text-[11px] text-[#94A3B8]">신뢰도</p>
          <p className="mt-1 text-sm font-semibold text-[#1E7F4F]">
            {formatConfidence(result.confidence)}
          </p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-6 text-white">{copy.summary}</p>
      <p className="mt-3 text-sm leading-6 text-[#2BE7A7]">
        추천 유형: {copy.shoeType}
      </p>
      <p className="mt-3 text-sm leading-6 text-[#CBD5E1]">
        {copy.recommendation}
      </p>
    </section>
  );
}

export default function OutsoleResultPage() {
  const [result, setResult] = useState<OutsoleAnalysisResult | null>(null);
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);

  useEffect(() => {
    const latest =
      window.sessionStorage.getItem(LATEST_RESULT_KEY) ??
      window.localStorage.getItem(LATEST_RESULT_KEY);

    if (latest) {
      setResult(JSON.parse(latest) as OutsoleAnalysisResult);
    }
  }, []);

  const shareToKakao = () => {
    if (!isKakaoLoaded || !window.Kakao) {
      alert("공유 기능을 준비 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    if (!result) return;

    const shareUrl = window.location.href;

    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "ShoePlan: 아웃솔 분석 결과",
        description: `왼쪽 신발은 '${OUTSOLE_CLASS_LABEL[result.left.className]}', 오른쪽 신발은 '${OUTSOLE_CLASS_LABEL[result.right.className]}' 입니다.`,
        imageUrl: result.leftImageUrl ?? "https://imgur.com/a/vvorfF2",
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: "결과 보러가기",
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        {
          title: "나도 분석하기",
          link: {
            mobileWebUrl: `${window.location.origin}/shoe/outsole`,
            webUrl: `${window.location.origin}/shoe/outsole`,
          },
        },
      ],
    });
  };

  if (!result) {
    return (
      <>
        <HeaderBar title="Result" hideBackBtn />
        <div className="flex h-[calc(100vh-11vh)] flex-col items-center justify-center gap-4 px-6 text-center text-[#CBD5E1]">
          <AlertTriangle className="text-[#94A3B8]" size={34} />
          <p className="text-white">결과를 불러올 수 없습니다.</p>
          <Link
            className="flex h-9 min-w-29 items-center justify-center rounded-2xl bg-[#1E7F4F] px-5 text-sm text-white"
            href="/shoe/outsole"
          >
            다시 분석하기
          </Link>
        </div>
        <TabBar />
      </>
    );
  }

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
        integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
        crossOrigin="anonymous"
        onReady={() => {
          if (!window.Kakao) return;

          if (window.Kakao.isInitialized()) {
            setIsKakaoLoaded(true);
            return;
          }

          const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
          if (kakaoKey) {
            window.Kakao.init(kakaoKey);
            setIsKakaoLoaded(true);
          } else {
            console.error("환경변수에 카카오 JS 키가 없습니다.");
          }
        }}
      />
      <HeaderBar title="Result" hideBackBtn />

      <div className="h-[calc(100vh-11vh)] overflow-y-auto px-5 pt-7 pb-32 text-[#CBD5E1]">
        <div className="mx-auto flex w-full max-w-92.5 flex-col gap-5">
          <section className="text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#1E7F4F]/20 text-[#1E7F4F]">
              <Sparkles size={22} />
            </div>
            <p className="text-sm text-[#94A3B8]">Outsole Analysis</p>
            <h1 className="mt-2 text-xl font-bold text-white">
              아웃솔 분석 결과
            </h1>
          </section>

          <FootResultCard
            imageUrl={result.leftImageUrl}
            result={result.left}
            title="왼쪽 신발"
          />
          <FootResultCard
            imageUrl={result.rightImageUrl}
            result={result.right}
            title="오른쪽 신발"
          />

          <div className="mx-auto flex w-full max-w-74 justify-between pt-2">
            <button
              className="flex h-8.75 min-w-29 items-center justify-center rounded-2xl bg-[#6B7280] px-4 text-sm text-white hover:bg-[#6b7280cc]"
              onClick={shareToKakao}
              type="button"
            >
              <Share className="mr-1" size={15} />
              Share
            </button>
            <Link
              className="flex h-8.75 min-w-29 items-center justify-center rounded-2xl bg-[#1E7F4F] px-4 text-sm font-light text-white hover:bg-[#196e43]"
              href="/home"
            >
              <House className="mr-1" size={15} />
              Home
            </Link>
          </div>
        </div>
      </div>

      <TabBar />
    </>
  );
}
