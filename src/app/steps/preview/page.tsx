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
        <div className="text-center relative top-15">
          <p className="text-[#CBD5E1] text-2xl">현재 러닝화 상태</p>
        </div>

        <div className="relative top-30">
          <p className="text-white text-2xl font-semibold text-center">
            {isExceeded ? (
              <>권장 수명을 초과했습니다</>
            ) : (
              <>
                교체까지 약
                <span className="text-[#1E7F4F] pl-2 pr-1">
                  {shoeLife?.remainingMonths}
                </span>
                개월
              </>
            )}
          </p>
        </div>

        {/* 러닝화 추천 이미지 */}
        <div>
          <p className="text-[#CBD5E1] text-center relative top-58">
            당신의 러닝 스타일에 딱 맞는 러닝화 추천
          </p>
          <div className="relative overflow-hidden w-45 aspect-square mx-auto top-60">
            <Image
              src={`/preview-images/${randomShoe}.webp`}
              alt="shoe-image"
              fill
              className="object-cover"
            />
            {/* Image blur */}
            <div className="absolute inset-x-0 top-1 bottom-3 overflow-hidden backdrop-blur-[7px]" />
          </div>
        </div>

        {/* Login CTA */}
        <MainBtn href="/login" className="mx-auto mt-90">
          러닝화 관리 시작하기 →
        </MainBtn>
      </div>
    </>
  );
}
