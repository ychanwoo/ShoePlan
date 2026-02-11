"use client";

import HeaderBar from "@/components/common/HeaderBar";
import TabBar from "@/components/common/TabBar";
import ShoeLifeProgress from "@/components/homeTab/ShoeLifeProgress";

export default function HomePage() {
  return (
    <>
      <HeaderBar title="Home" showInfo />

      <div className="h-[calc(100vh-11vh)] overflow-y-auto">
        <div className="flex flex-col items-center relative top-25">
          <ShoeLifeProgress percentage={72} />
        </div>

        <div className="text-[#CBD5E1] text-center relative top-40">
          <p className="font-light">아직 사용하기 좋아요</p>
          <p className="text-2xl">교체 권장 까지 {130}일 남음</p>
        </div>

        <div className="text-[#CBD5E1] text-center space-y-3 font-light relative top-55">
          <p>
            총 권장 수명: <span>{500}km</span>
          </p>
          <p>
            현재 주행 거리: <span>{160}km</span>
          </p>
        </div>
      </div>

      <TabBar />
    </>
  );
}
