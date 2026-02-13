"use client";
import Image from "next/image";
import LogoImg from "@/assets/logo.svg";
import { StepNavigationProps } from "@/types/StepNavigationProps";
import PrevBtn from "../button/PrevBtn";
import NextBtn from "../button/NextBtn";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { shoeType } from "@/types/shoeType";

const brands = ["Nike", "Adidas", "Asics", "New Balance"];

//* 임시 더미 데이터 추후 수정 예정
const models: Record<string, string[]> = {
  Nike: ["Pegasus", "Vaporfly", "Invincible"],
  Adidas: ["Adizero Boston", "Adios Pro"],
  Asics: ["Nimbus", "Kayano", "Magic Speed", "Meta Speed"],
  "New Balance": ["1080", "FuelCell Rebel"],
};

export default function StepFourPage({ onNext, onPrev }: StepNavigationProps) {
  const [open, setOpen] = useState<shoeType>(null);
  const [value, setValue] = useState({
    brand: "",
    model: "",
  });
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
        <div>●●●●○</div>
      </div>

      {/* Running Shoe Selection 설명 */}
      <div className="text-[#CBD5E1] ml-7">
        <h3 className="text-xl mb-3">Running Shoe Selection</h3>
        <p>현재 신고 있는 러닝화는요?</p>
        <p>모델을 알면 더 정확하게 계산할 수 있어요</p>
      </div>

      <div className="text-[#CBD5E1] mt-20 space-y-20">
        {/* Brand 선택 */}
        <div className="ml-7 flex items-center justify-between w-75 text-[#CBD5E1]">
          <span className="text-xl">Brand</span>
          <button
            className="flex items-center gap-2 border-b border-[#CBD5E1] w-40 justify-center"
            onClick={() => setOpen("brand")}
          >
            <span>{value.brand || "Select"}</span>
            <ChevronDown className="text-[#CBD5E1] relative left-5" />
          </button>
        </div>

        {/* Model 선택 */}
        <div className="ml-7 flex items-center justify-between w-75 text-[#CBD5E1]">
          <span className="text-xl">Model</span>
          <button
            disabled={!value.brand}
            className="flex items-center gap-2 border-b border-[#CBD5E1] w-40 justify-center disabled:text-[#cbd5e149]"
            onClick={() => setOpen("model")}
          >
            <span>{value.model || "Select"}</span>
            <ChevronDown className="text-[#CBD5E1] relative left-5" />
          </button>
        </div>
      </div>

      {/* 버튼 영역 - 화면 하단에 좌우 배치 */}
      <div className="absolute bottom-13 left-0 right-0 flex justify-between px-8">
        <PrevBtn onClick={onPrev}>← Prev</PrevBtn>
        <NextBtn onClick={onNext}>Next →</NextBtn>
      </div>

      {/* Brand Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 text-[#CBD5E1] flex items-end z-50 w-97.5 mx-auto">
          <div className="w-full bg-[#27323A] rounded-t-2xl p-6">
            {/* Title */}
            <h2 className="text-lg font-semibold mb-4 capitalize">
              Select {open}
            </h2>

            {/* List */}
            <div className="max-h-80 overflow-y-auto space-y-3">
              {(open === "brand" ? brands : models[value.brand] || []).map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setValue((prev) => ({
                        ...prev,
                        [open]: item,
                        ...(open === "brand" && { model: "" }),
                      }));
                      setOpen(null);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl transition
                ${
                  value[open] === item
                    ? "bg-white text-black"
                    : "bg-[#1E293B] hover:bg-[#334155]"
                }`}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>

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
