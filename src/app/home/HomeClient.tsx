"use client";

import HeaderBar from "@/components/common/HeaderBar";
import TabBar from "@/components/common/TabBar";
import ShoeLifeProgress from "@/components/homeTab/ShoeLifeProgress";
import { calculateShoeLife } from "@/utils/calculateShoeLife";

export default function HomeClient() {
  const shoeLife = calculateShoeLife();
  if (!shoeLife) return null;
  const remainmingKm = shoeLife.recommendedLife - shoeLife.usedDistance;
  const remainingPercent = shoeLife.usagePercent;
  let messeage = "";

  if (remainingPercent >= 80) {
    messeage = "아직 여유 있어요";
  } else if (remainingPercent >= 50) {
    messeage = "아직 사용하기 좋아요";
  } else if (remainingPercent >= 30) {
    messeage = "교체 시기 슬슬";
  } else {
    messeage = "새 신발 고민해볼 때";
  }

  return (
    <>
      <HeaderBar title="Home" showInfo />

      <div className="h-[calc(100vh-11vh)] overflow-y-auto pb-100">
        <div className="flex flex-col items-center relative top-25">
          <ShoeLifeProgress percentage={shoeLife?.usagePercent} />
        </div>

        <div className="text-[#CBD5E1] text-center relative top-40">
          {/* percentage에 따라 문구 조정 */}
          <p className="font-light">{messeage}</p>
          <p className="text-2xl">
            교체 권장 까지{" "}
            <span className="text-[#1E7F4F] font-semibold">
              {shoeLife.remainingMonths}개월
            </span>{" "}
            남음
          </p>
        </div>

        <div className="text-[#CBD5E1] text-center space-y-3 font-light relative top-55">
          <p>
            총 권장 수명: <span>{shoeLife.recommendedLife}km</span>
          </p>
          {shoeLife.usagePercent >= 100 ? (
            <p>
              총 달린 거리: <span>{shoeLife.usedDistance}km</span>
            </p>
          ) : (
            <p>
              남은 주행 거리: <span>{remainmingKm}km</span>
            </p>
          )}
        </div>
      </div>

      <TabBar />
    </>
  );
}
