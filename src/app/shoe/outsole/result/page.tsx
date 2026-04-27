"use client";

import HeaderBar from "@/components/common/HeaderBar";
import TabBar from "@/components/common/TabBar";
import { KakaoShareParams } from "@/types/kakaoShareParams";
import { AlertTriangle, Share, Sparkles } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";

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

const WEAR_SIDE_LABEL: Record<OutsoleAnalysis["dominantWearSide"], string> = {
  balanced: "균형",
  inside: "안쪽",
  outside: "바깥쪽",
};

const WEAR_SEVERITY_LABEL: Record<OutsoleAnalysis["wearSeverity"], string> = {
  high: "높음",
  low: "낮음",
  medium: "보통",
};

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

export default function OutsoleResultPage() {
  const [result, setResult] = useState<OutsoleAnalysis | null>(null);
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);

  useEffect(() => {
    const latest = window.sessionStorage.getItem(LATEST_RESULT_KEY);
    if (latest) {
      setResult(JSON.parse(latest) as OutsoleAnalysis);
      return;
    }

    const history = window.localStorage.getItem(HISTORY_KEY);
    if (history) {
      const parsed = JSON.parse(history) as OutsoleAnalysis[];
      setResult(parsed[0] ?? null);
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
        title: "👟 ShoePlan: 아웃솔 분석 결과",
        description: `마모 위치는 '${WEAR_SIDE_LABEL[result.dominantWearSide]}', 마모 강도는 '${WEAR_SEVERITY_LABEL[result.wearSeverity]}' 입니다.`,
        imageUrl: "https://i.imgur.com/i3NPkiP.jpeg",
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

          {result.imageUrl ? (
            <section className="overflow-hidden rounded-2xl bg-[#242E35] p-4 shadow-lg">
              {/* Data URL preview from the user's uploaded image. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="분석한 아웃솔 이미지"
                className="h-58 w-full rounded-2xl object-cover"
                src={result.imageUrl}
              />
            </section>
          ) : null}

          <section className="rounded-2xl bg-[#242E35] p-4 shadow-lg">
            <h2 className="text-lg font-bold text-white">최근 분석 결과</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#1B242C] p-4">
                <p className="text-xs text-[#94A3B8]">마모 위치</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {WEAR_SIDE_LABEL[result.dominantWearSide]}
                </p>
              </div>
              <div className="rounded-2xl bg-[#1B242C] p-4">
                <p className="text-xs text-[#94A3B8]">마모 강도</p>
                <p className="mt-2 text-lg font-semibold text-[#1E7F4F]">
                  {WEAR_SEVERITY_LABEL[result.wearSeverity]}
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-white">
              {result.summary}
            </p>
            <p className="mt-3 text-sm leading-6 text-white">
              {result.recommendation}
            </p>
          </section>

          <div className="flex justify-center gap-x-20 pt-2">
            <button
              className="flex h-8.75 w-29 items-center justify-center rounded-2xl bg-[#6B7280] text-sm text-white hover:bg-[#6b7280cc]"
              onClick={shareToKakao}
              type="button"
            >
              <Share className="mr-1" size={15} />
              Share
            </button>
            <Link
              className="flex h-8.75 w-29 items-center justify-center rounded-2xl bg-[#1E7F4F] text-sm font-light text-white hover:bg-[#196e43]"
              href="/home"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>

      <TabBar />
    </>
  );
}
