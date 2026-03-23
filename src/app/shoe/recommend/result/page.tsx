"use client";
import HeaderBar from "@/components/common/HeaderBar";
import TabBar from "@/components/common/TabBar";
import Image from "next/image";
import { Share } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Shoe } from "@/data/shoeDB";
import { getRecommendations } from "@/utils/recommendAlgorithm";
import Script from "next/script";
import { KakaoShareParams } from "@/types/kakaoShareParams";
interface RecommendResult {
  bestMatch: Shoe & { score: number; matchedReasons: string[] };
  alternatives: (Shoe & { score: number; matchedReasons: string[] })[];
  reasonText: string;
}
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

export default function ResultPage() {
  const [result, setResult] = useState<RecommendResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);

  useEffect(() => {
    const fetchAndRecommend = async () => {
      try {
        const [res] = await Promise.all([
          fetch("/api/updateStats"),
          new Promise((resolve) => setTimeout(resolve, 3000)),
        ]);
        const json = await res.json();

        if (json.data) {
          const recommendation = getRecommendations(json.data);
          setResult(recommendation as RecommendResult);
        }
      } catch (error) {
        console.error("데이터 로딩 에러", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndRecommend();
  }, []);

  const shareToKakao = () => {
    if (!isKakaoLoaded || !window.Kakao) {
      alert("공유 기능을 준비 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    if (!result) return;

    const { bestMatch } = result;
    const shareUrl = window.location.href;

    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "👟 ShoePlan: 나만의 러닝화 추천 결과",
        description: `제게 딱 맞는 러닝화는 '${bestMatch.name}' 입니다!`,
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
          title: "나도 추천받기",
          link: {
            mobileWebUrl: window.location.origin,
            webUrl: window.location.origin,
          },
        },
      ],
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-[#2F3941] flex flex-col items-center justify-center text-[#CBD5E1]">
        <div className="w-10 h-10 border-4 border-[#1E7F4F] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="animate-pulse">유저 데이터를 분석 중입니다...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-screen bg-[#2F3941] flex items-center justify-center">
        <p className="text-white">
          결과를 불러올 수 없습니다. 다시 시도해 주세요.
        </p>
      </div>
    );
  }

  const { bestMatch, alternatives, reasonText } = result;

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
        integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
        crossOrigin="anonymous"
        onReady={() => {
          if (window.Kakao && !window.Kakao.isInitialized()) {
            const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
            if (kakaoKey) {
              window.Kakao.init(kakaoKey);
              setIsKakaoLoaded(true);
            } else {
              console.error("환경변수에 카카오 JS 키가 없습니다.");
            }
          }
        }}
      />
      <HeaderBar title="Result" hideBackBtn={true} />
      <div className="pt-5 pb-25 h-[calc(100vh-11vh)] overflow-y-auto">
        {/* Best Match */}
        <div className="text-[#CBD5E1] pl-5">
          <h2 className="font-semibold pb-3">🏆 Best Match</h2>
          <div className="flex flex-col mr-3">
            <p className="font-light text-center pb-2">{bestMatch.name}</p>
            <div className="flex justify-center overflow-hidden">
              <Image
                src={bestMatch.image}
                alt={bestMatch.name}
                width={150}
                height={150}
                className="rounded-md"
              />
            </div>
          </div>
        </div>
        {/* Why this shoe */}
        <div className="text-[#CBD5E1] pt-5">
          <h2 className="font-semibold pl-5 pb-1">🧠 Why this shoe?</h2>
          <div className="bg-[#242E35] w-100 h-30 rounded-2xl mx-auto mt-1">
            <p className="text-sm px-5 pt-7">{reasonText}</p>
          </div>
        </div>
        {/* Picks */}
        <div className="text-[#CBD5E1] pt-5">
          <h2 className="pl-5 font-semibold">🥈 Alternative Picks</h2>
          <div className="flex justify-center gap-x-20 mt-5">
            {alternatives.map((alt) => (
              <div key={alt.id} className="flex-col text-center w-35">
                <div className="flex justify-center h-25 items-center mb-2">
                  <Image
                    src={alt.image}
                    alt={alt.name}
                    width={120}
                    height={120}
                    className="object-contain rounded-md"
                  />
                </div>
                {/* 신발 이름 (길면 한 줄로 자름) */}
                <p className="text-sm font-medium line-clamp-1 pt-3">
                  {alt.name}
                </p>
                <p className="text-[#5e967a] text-xs">{alt.tags[0]} 중심</p>
              </div>
            ))}
          </div>
        </div>
        {/* buttons */}
        <div className="flex justify-between px-13 pt-5">
          <button
            onClick={shareToKakao}
            className="text-white text-sm w-29 h-8.75 rounded-2xl bg-[#6B7280] flex items-center justify-center hover:bg-[#6b7280cc]"
          >
            <Share size={15} className="mr-1" />
            Share
          </button>
          <Link
            href="/home"
            className="text-white text-sm font-light w-29 h-8.75 rounded-2xl bg-[#1E7F4F] flex items-center justify-center hover:bg-[#196e43]"
          >
            Go to Home
          </Link>
        </div>
      </div>
      <TabBar />
    </>
  );
}
