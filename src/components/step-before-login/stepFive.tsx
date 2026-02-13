"use client";
import Image from "next/image";
import LogoImg from "@/assets/logo.svg";
import { StepNavigationProps } from "@/types/StepNavigationProps";
import NextBtn from "../button/NextBtn";
import { useState } from "react";
import PrevBtn from "../button/PrevBtn";
import Link from "next/link";
import { getSurveyData, setSurveyData } from "@/lib/surveyStorage";

const options = ["1~3 개월", "3~6 개월", "6~12 개월", "1~2 년", "2년 이상"];

export default function StepFivePage({ onNext, onPrev }: StepNavigationProps) {
  const saved = getSurveyData();
  const initialSelected = options.includes(saved.shoeAge || "")
    ? saved.shoeAge!
    : null;
  const [selected, setSelected] = useState<string | null>(initialSelected);

  const handleSelect = (option: string) => {
    setSelected(option);
    setSurveyData({ shoeAge: option });
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
        <div>●●●●●</div>
      </div>

      {/* Shoe Age 설명 */}
      <div className="text-[#CBD5E1] ml-7">
        <h3 className="text-xl mb-3">Shoe Age</h3>
        <p>언제 부터 신기 시작하셨나요?</p>
        <p>대략적인 시기만 알아도 충분해요</p>
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
        <Link href="/steps/preview" className="text-sm">
          <NextBtn onClick={onNext}>결과보기</NextBtn>
        </Link>
      </div>
    </>
  );
}
