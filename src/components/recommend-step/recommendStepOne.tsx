"use client";

import { useState } from "react";
import NextBtn from "../common/NextBtn";
import { StepNavigationProps } from "@/types/StepNavigationProps";

const options = ["Road (아스팔트)", "Track (트랙)", "Mixed (혼합)"];

export default function RecommendStepOnePage({ onNext }: StepNavigationProps) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="pt-5 pb-25 h-[calc(100vh-11vh)] overflow-y-auto">
      <p className="text-center text-[#CBD5E1] text-sm pt-10">
        러닝 스타일에 맞는 추천을 위해 몇 가지만 선택해 주세요
      </p>
      {/* Process */}
      <div className="text-[#CBD5E1] flex gap-x-5 text-xl ml-10 mt-15 mb-8">
        <h2>Process</h2>
        <div>●○○</div>
      </div>

      {/* Running Type 설명 */}
      <div className="text-[#CBD5E1] ml-10">
        <h3 className="text-xl mb-3">Running Type</h3>
        <p>주로 어디에서 러닝을 즐기시나요?</p>
      </div>

      {/* data input */}
      <div className="pl-10 pt-15 space-y-5">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-3 text-[#CBD5E1] cursor-pointer"
          >
            <input
              type="checkbox"
              name="type"
              checked={selected === option}
              onChange={() => setSelected(option)}
              className="w-5 h-5 accent-[#1E7F4F]"
            />

            <span className="flex items-center gap-2">{option}</span>
          </label>
        ))}
      </div>

      {/* 버튼 영역 - 화면 하단에 좌우 배치 */}
      <div className="flex justify-end px-8 mt-45">
        <NextBtn onClick={onNext}>Next →</NextBtn>
      </div>
    </div>
  );
}
