"use client";

import LogoImg from "@/assets/logo.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import Picker from "react-mobile-picker";
import { StepNavigationProps } from "@/types/StepNavigationProps";
import NextBtn from "../button/NextBtn";
import { getSurveyData, setSurveyData } from "@/lib/surveyStorage";

const heights = Array.from({ length: 101 }, (_, i) => i + 130); // 130~230
const weights = Array.from({ length: 101 }, (_, i) => i + 40); // 40~140

export default function StepOnePage({ onNext }: StepNavigationProps) {
  const saved = getSurveyData();

  const [value, setValue] = useState({
    height: saved.height || 160,
    weight: saved.weight || 50,
  });

  const [open, setOpen] = useState<"height" | "weight" | null>(null);

  //* 값 바뀔때마다 sessionStorage에 저장
  const handleChange = (key: "height" | "weight", val: number) => {
    setValue((prev) => ({ ...prev, [key]: val }));
    setSurveyData({ [key]: val });
  };

  // * Bottom sheet 열릴 떄 body 스크롤 방지
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

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
        <div>●○○○○</div>
      </div>

      {/* Height / Weight 설명 */}
      <div className="text-[#CBD5E1] ml-7">
        <h3 className="text-xl mb-3">Height / weight</h3>
        <p>체중과 체형은 러닝화 마모에 영향을 줘요</p>
        <p>정확하지 않아도 괜찮아요</p>
      </div>

      {/* data input */}
      <div className="text-[#CBD5E1] mt-20 space-y-20">
        {/* Height */}
        <div className="ml-7 flex items-center justify-between w-75">
          <span className="text-xl">Height</span>

          <button
            onClick={() => setOpen("height")}
            className="flex items-center gap-2 border-b border-[#CBD5E1] w-24 justify-center"
          >
            <span>{value.height}</span>
            <span>cm</span>
          </button>
        </div>

        {/* Weight */}
        <div className="ml-7 flex items-center justify-between w-75">
          <span className="text-xl">Weight</span>

          <button
            onClick={() => setOpen("weight")}
            className="flex items-center gap-2 border-b border-[#CBD5E1] w-24 justify-center"
          >
            <span>{value.weight}</span>
            <span>kg</span>
          </button>
        </div>
      </div>

      {/* Next 버튼 */}
      <div className="absolute bottom-13 left-0 right-0 flex justify-end px-8">
        <NextBtn onClick={onNext}>Next →</NextBtn>
      </div>

      {/* Bottom Sheet + Picker */}
      {open && (
        <div className="fixed inset-0 bg-black/50 text-[#CBD5E1] flex items-end z-50 max-w-110 mx-auto overscroll-none">
          <div className="w-full bg-[#27323A] rounded-t-2xl p-6">
            <Picker
              value={{ [open]: value[open] }}
              onChange={(v) => handleChange(open, Number(v[open]))}
            >
              <Picker.Column name={open}>
                {(open === "height" ? heights : weights).map((n) => (
                  <Picker.Item key={n} value={n}>
                    {n}
                  </Picker.Item>
                ))}
              </Picker.Column>
            </Picker>

            <button
              className="mt-6 w-full bg-white text-black py-3 rounded-xl hover:bg-[#ffffffcd]"
              onClick={() => setOpen(null)}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
