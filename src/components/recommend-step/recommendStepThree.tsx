"use client";

import { useState } from "react";
import PrevBtn from "../button/PrevBtn";
import NextBtn from "../button/NextBtn";
import { StepNavigationProps } from "@/types/StepNavigationProps";
import Link from "next/link";

const options = [
  { id: 1, label: "쿠션감이 좋았다" },
  { id: 2, label: "안정감이 있었다" },
  { id: 3, label: "가볍게 느껴졌다" },
  { id: 4, label: "반발력이 좋았다" },
  { id: 5, label: "착용감이 편했다" },
  { id: 6, label: "장거리 러닝에 편했다" },
  { id: 7, label: "인터벌 러닝에 편했다" },
  { id: 8, label: "통기성이 좋았다" },
];

export default function RecommendStepThreePage({
  onPrev,
  onNext,
}: StepNavigationProps) {
  const [selected, setSelected] = useState<number[]>([]);
  return (
    <div className="pt-5 pb-25 h-[calc(100vh-11vh)] overflow-y-auto">
      <p className="text-center text-[#CBD5E1] text-sm pt-10">
        러닝 스타일에 맞는 추천을 위해 몇 가지만 선택해 주세요
      </p>
      {/* Process */}
      <div className="text-[#CBD5E1] flex gap-x-5 text-xl ml-10 mt-15 mb-8">
        <h2>Process</h2>
        <div>●●●</div>
      </div>

      {/* Current Shoe - Cons */}
      <div className="text-[#CBD5E1] ml-10">
        <h3 className="text-xl mb-3">Current Shoe - Pros</h3>
        <p>현재 신고있는 러닝화에서</p>
        <p>좋은 점을 골라주세요 (복수 선택 가능)</p>
      </div>

      {/* data input */}
      <div className="pl-10 pt-15 space-y-5">
        {options.map((option) => (
          <label
            key={option.id}
            className="flex items-center gap-3 text-[#CBD5E1] cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selected.includes(option.id)}
              onChange={() =>
                setSelected((prev) =>
                  prev.includes(option.id)
                    ? prev.filter((id) => id !== option.id)
                    : [...prev, option.id],
                )
              }
              className="w-5 h-5 accent-[#1E7F4F]"
            />

            <span>{option.label}</span>
          </label>
        ))}
      </div>

      {/* 버튼 영역 - 화면 하단에 좌우 배치 */}
      <div className="flex justify-between px-8 mt-45">
        <PrevBtn onClick={onPrev}>← Prev</PrevBtn>
        <Link href="/shoe/recommend/result" className="text-sm">
          <NextBtn onClick={onNext}>결과보기</NextBtn>
        </Link>
      </div>
    </div>
  );
}
