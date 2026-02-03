"use client";

import LogoImg from "@/assets/logo.svg";
import Image from "next/image";
import { StepNavigationProps } from "@/types/StepNavigationProps";
import NextBtn from "../common/NextBtn";
import PrevBtn from "../common/PrevBtn";
import { useState } from "react";

const options = [
  "20km 미만",
  "20~50km",
  "50~100km",
  "100~300km",
  "300km 이상",
  "직접입력",
];

export default function StepTwoPage({ onNext, onPrev }: StepNavigationProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [customKm, setCustomKm] = useState("");

  return (
    <>
      {/* 상단 로고 이미지 */}
      <div>
        <Image
          src={LogoImg}
          alt="Logo-image"
          width={100}
          height={100}
          className="ml-3"
        />
      </div>

      {/* Process */}
      <div className="text-[#CBD5E1] flex gap-x-5 text-xl ml-7 mt-5 mb-10">
        <h2>Process</h2>
        <div>●●○○○</div>
      </div>

      {/* Running Distance 설명 */}
      <div className="text-[#CBD5E1] ml-7">
        <h3 className="text-xl mb-3">Running Distance</h3>
        <p>한 달에 얼마나 달리시나요?</p>
        <p>대략적인 거리만 알아도 충분해요</p>
      </div>

      {/* data input */}
      <div className="pl-7 pt-15 space-y-5">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-3 text-[#CBD5E1] cursor-pointer"
          >
            <input
              type="checkbox"
              name="distance"
              checked={selected === option}
              onChange={() => setSelected(option)}
              className="w-5 h-5 accent-[#1E7F4F]"
            />

            <span className="flex items-center gap-2">
              {option === "직접입력" ? (
                <>
                  직접입력
                  <input
                    type="number"
                    placeholder="____"
                    disabled={selected !== "직접입력"}
                    value={customKm}
                    onChange={(e) => setCustomKm(e.target.value)}
                    className="w-20 bg-transparent border-b border-gray-400 text-white text-center outline-none disabled:opacity-40"
                  />
                  km
                </>
              ) : (
                option
              )}
            </span>
          </label>
        ))}
      </div>

      {/* 버튼 영역 - 화면 하단에 좌우 배치 */}
      <div className="absolute bottom-13 left-0 right-0 flex justify-between px-8">
        <PrevBtn onClick={onPrev}>← Prev</PrevBtn>
        <NextBtn onClick={onNext}>Next →</NextBtn>
      </div>
    </>
  );
}
