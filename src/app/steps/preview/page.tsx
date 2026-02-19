"use client";
import Image from "next/image";
import LogoImg from "@/assets/logo.svg";
import ExShoe from "@/assets/preview-images/example-shoe.png";
import MainBtn from "@/components/button/MainBtn";
import { calculateShoeLife } from "@/utils/calculateShoeLife";
import { useEffect, useState } from "react";

export default function PreviewPage() {
  const [shoeLife, setShoeLife] = useState<ReturnType<
    typeof calculateShoeLife
  > | null>(null);

  useEffect(() => {
    const result = calculateShoeLife();
    setShoeLife(result);
  }, []);

  if (!shoeLife) return null;

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
          <div className="relative overflow-hidden w-45 h-45 mx-auto top-60">
            <Image
              src={ExShoe}
              alt="shoe-image"
              fill
              className="object-cover"
            />
            {/* Image blur */}
            <div className="absolute inset-x-2 top-1 bottom-3 overflow-hidden backdrop-blur-[7px]" />
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
