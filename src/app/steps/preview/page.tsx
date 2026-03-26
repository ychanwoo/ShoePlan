"use client";
import Image from "next/image";
import LogoImg from "@/assets/logo.svg";
import MainBtn from "@/components/button/MainBtn";
import { calculateShoeLife } from "@/utils/calculateShoeLife";
import { useEffect, useState } from "react";

// * preview 이미지에 사용할 신발 리스트 (이미지 파일명)
const shoes = [
  // Nike
  "nike-pegasus",
  "nike-vomero",
  "nike-zoomfly",
  "nike-vaporfly",
  "nike-alphafly",

  // Adidas
  "adidas-boston",
  "adidas-adios-pro-3",
  "adidas-evo-sl",
  "adidas-adios-pro-4",
  "adidas-supernova-rise",

  // Puma
  "puma-velocity",
  "puma-deviate",
  "puma-deviate-elite",
  "puma-fast-r-elite",

  // New Balance
  "nb-freshfoam",
  "nb-sc-trainer",
  "nb-rebel",
  "nb-sc-elite",
  "nb-sc-pacer",

  // Asics
  "asics-kayano",
  "asics-novablast",
  "asics-superblast",
  "asics-magicspeed",
  "asics-metaspeed",

  // Mizuno
  "mizuno-inspire",
  "mizuno-neo-vista",
  "mizuno-rebellion-flash-2",
  "mizuno-rebellion-pro-2",

  // Hoka
  "hoka-bondi",
  "hoka-clifton",
  "hoka-mach-x-2",
  "hoka-skyward-x",
  "hoka-mach-6",
  "hoka-rocket-x-2",

  // Saucony
  "saucony-endorphin-speed-4",
  "saucony-endorphin-pro-4",
  "saucony-endorphin-elite",

  // On
  "on-cloudmonster",
  "on-cloudmonster-hyper",
  "on-cloudsurfer-max",
  "on-cloudboom-max",
  "on-cloudboom-strike",
];

export default function PreviewPage() {
  const [randomShoe, setRandomShoe] = useState<string | null>(null);
  const [shoeLife, setShoeLife] = useState<ReturnType<
    typeof calculateShoeLife
  > | null>(null);

  useEffect(() => {
    // 계산된 ShoeLife가져오기
    const result = calculateShoeLife();
    setShoeLife(result);

    // 이미지 sessionStorage에 저장
    const saved = sessionStorage.getItem("previewImage");
    if (saved) {
      setRandomShoe(saved);
    } else {
      const random = shoes[Math.floor(Math.random() * shoes.length)];
      sessionStorage.setItem("previewImage", random);
      setRandomShoe(random);
    }
  }, []);

  if (!randomShoe || !shoeLife) return null;

  const isExceeded =
    shoeLife.remainingMonths === 0 && shoeLife.usagePercent === 0;
  return (
    <>
      {/* 상단 로고 이미지*/}
      <div>
        <Image
          src={LogoImg}
          alt="Logo-image"
          width={100}
          height={100}
          className="ml-3"
        />
      </div>

      <div className="pb-10">
        <div className="text-center relative top-10">
          <p className="text-[#CBD5E1] text-2xl">현재 러닝화 상태</p>
        </div>
        <div className="relative top-15 px-4 w-full max-w-[320px] mx-auto">
          <div
            className={`flex items-center justify-center py-3 rounded-2xl border ${
              isExceeded
                ? "bg-[#1B242C]/80 border-red-900"
                : "bg-[#1B242C]/80 border-[#1E7F4F]"
            }`}
          >
            <p className="text-[#CBD5E1] text-base font-medium flex items-center justify-center gap-1">
              {isExceeded ? (
                <span className="text-rose-700 font-bold">
                  권장 수명을 초과했습니다
                </span>
              ) : (
                <>
                  교체까지 약
                  <span className="text-[#22c55e] text-2xl font-bold px-1 tracking-tight mb-1">
                    {shoeLife?.remainingMonths}
                  </span>
                  <span>개월</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="relative top-30 flex flex-col items-center px-4">
          <p className="text-[#CBD5E1] text-center mb-6">
            당신의 러닝 스타일에 딱 맞는 러닝화 추천
          </p>

          <div className="relative overflow-hidden w-45 aspect-square rounded-2xl mb-8">
            <Image
              src={`/preview-images/${randomShoe}.webp`}
              alt="shoe-image"
              fill
              className="object-cover"
            />
            {/* Image blur */}
            <div className="absolute inset-x-0 top-1 bottom-3 overflow-hidden backdrop-blur-[7px]" />
            {/* Lock */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="w-14 h-14 bg-[#1B242C]/80 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md">
                <span className="text-3xl">🔒</span>
              </div>
            </div>
          </div>

          <div className="text-center w-full mt-5">
            <h3 className="text-white text-lg font-bold mb-2">
              나랑 잘 맞는 러닝화는 무엇일까?
            </h3>
            <p className="text-[#CBD5E1] text-sm leading-relaxed">
              기존 러닝화 수명 관리부터 <br />
              <span className="text-[#22c55e] font-bold">
                딱 맞는 러닝화 추천
              </span>
              까지 한 번에!
            </p>
          </div>
        </div>

        {/* Login CTA */}
        <MainBtn href="/login" className="mx-auto relative top-45">
          3초 만에 시작하고 결과 보기 →
        </MainBtn>
      </div>
    </>
  );
}
