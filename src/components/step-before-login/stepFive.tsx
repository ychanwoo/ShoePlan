"use client";
import Image from "next/image";
import LogoImg from "@/assets/logo.svg";
import { StepNavigationProps } from "@/types/StepNavigationProps";
import NextBtn from "../button/NextBtn";
import { useState } from "react";
import PrevBtn from "../button/PrevBtn";
import { getSurveyData, setSurveyData } from "@/lib/surveyStorage";
import RecommendStepModal from "../common/RecommendStepModal";
import { useRouter } from "next/navigation";

const options = [
  "1개월",
  "3개월",
  "6개월",
  "9개월",
  "12개월",
  "18개월",
  "24개월 이상",
];

export default function StepFivePage({ onNext, onPrev }: StepNavigationProps) {
  const saved = getSurveyData();
  const router = useRouter();
  const initialSelected = options.includes(saved.shoeAge || "")
    ? saved.shoeAge!
    : null;
  const [selected, setSelected] = useState<string | null>(initialSelected);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    message: "",
  });

  const handleNext = () => {
    if (!selected) {
      setModalConfig({
        isOpen: true,
        message: "사용기간을 선택해 주세요 ⚠️",
      });
      return;
    }
    onNext();
    router.push("/steps/preview");
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, message: "" });
  };

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
        <p>몇 개월 동안 사용하셨나요?</p>
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
        <NextBtn onClick={handleNext}>결과보기</NextBtn>
      </div>

      <RecommendStepModal
        isOpen={modalConfig.isOpen}
        message={modalConfig.message}
        onClose={closeModal}
      />
    </>
  );
}
