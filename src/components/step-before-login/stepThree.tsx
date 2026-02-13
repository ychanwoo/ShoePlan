"use client";
import Image from "next/image";
import LogoImg from "@/assets/logo.svg";
import { StepNavigationProps } from "@/types/StepNavigationProps";
import PrevBtn from "../button/PrevBtn";
import NextBtn from "../button/NextBtn";
import { useState } from "react";
import { getSurveyData, setSurveyData } from "@/lib/surveyStorage";

const options = [
  "LSD(Long Slow Distance",
  "Tempo Run",
  "Interval Training / Race",
  "Mixed running",
];

export default function StepThreePage({ onNext, onPrev }: StepNavigationProps) {
  const saved = getSurveyData();
  const [selected, setSelected] = useState<string | null>(
    saved.runningType || null,
  );

  const handleSelect = (option: string) => {
    setSelected(option);
    setSurveyData({ runningType: option });
  };

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

      {/* Process */}
      <div className="text-[#CBD5E1] flex gap-x-5 text-xl ml-7 mt-5 mb-10">
        <h2>Process</h2>
        <div>●●●○○</div>
      </div>

      {/* Running Type 설명 */}
      <div className="text-[#CBD5E1] ml-7">
        <h3 className="text-xl mb-3">Running Type</h3>
        <p>주로 어떤 유형의 러닝을 하시나요?</p>
        <p>정확하지 않아도 충분해요</p>
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
              name="type"
              checked={selected === option}
              onChange={() => handleSelect(option)}
              className="w-5 h-5 accent-[#1E7F4F]"
            />

            <span className="flex items-center gap-2">{option}</span>
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
