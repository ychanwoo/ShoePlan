import HeaderBar from "@/components/common/HeaderBar";
import TabBar from "@/components/common/TabBar";
import Image from "next/image";
import exShoe from "@/assets/example-shoe.png";
import { Share } from "lucide-react";
import Link from "next/link";

export default function ResultPage() {
  return (
    <>
      <HeaderBar title="Result" />
      <div className="pt-5 pb-25 h-[calc(100vh-11vh)] overflow-y-auto">
        {/* Best Match */}
        <div className="text-[#CBD5E1] pl-5">
          <h2 className="font-semibold pb-3">🏆 Best Match</h2>
          <p className="font-light text-center pb-2">
            Nike Zoom X Invincible Run 3
          </p>
          <div className="flex justify-center overflow-hidden">
            <Image src={exShoe} alt="ex-shoe image" width={150} height={150} />
          </div>
        </div>
        {/* Why this shoe */}
        <div className="text-[#CBD5E1] pt-5">
          <h2 className="font-semibold pl-5 pb-1">🧠 Why this shoe?</h2>
          <div className="bg-[#242E35] w-96 h-30 rounded-2xl">
            <p className="text-sm px-5 pt-7">
              입력하신 러닝 스타일을 기준으로 가장 잘 맞는 러닝화입니다. 쿠션과
              안정감의 균형이 좋아, 현재 러닝화에서 느끼셨던 쿠션감 부족과
              전체적 밸런스를 보완해줍니다.
            </p>
          </div>
        </div>
        {/* Picks */}
        <div className="text-[#CBD5E1] pt-5">
          <h2 className="pl-5 font-semibold">🥈 Alternative Picks</h2>
          <div className="flex justify-center gap-x-14">
            <div className="flex-col text-center">
              <Image
                src={exShoe}
                alt="ex-shoe image"
                width={140}
                height={140}
              />
              <p>On Running Max</p>
              <p className="text-[#CBD5E1] text-xs">가벼운 착용감 중심</p>
            </div>
            <div className="flex-col text-center">
              <Image
                src={exShoe}
                alt="ex-shoe image"
                width={140}
                height={140}
              />
              <p>Zoom Vomero 3</p>
              <p className="text-[#CBD5E1] text-xs">쿠션감 중심 러닝화</p>
            </div>
          </div>
        </div>
        {/* buttons */}
        <div className="flex justify-between px-8 pt-5">
          <button className="text-white text-sm w-29 h-8.75 rounded-2xl bg-[#6B7280] flex items-center justify-center hover:bg-[#6b7280cc]">
            <Share size={15} className="mr-1" />
            Share
          </button>
          <Link
            href="/home"
            className="text-white text-sm font-light w-29 h-8.75 rounded-2xl bg-[#1E7F4F] flex items-center justify-center hover:bg-[#196e43]"
          >
            Go to Home
          </Link>
        </div>
      </div>
      <TabBar />
    </>
  );
}
