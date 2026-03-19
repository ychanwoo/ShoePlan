"use client";

import HeaderBar from "@/components/common/HeaderBar";
import Loading from "@/components/common/Loading";
import TabBar from "@/components/common/TabBar";
import ShoeLifeProgress from "@/components/homeTab/ShoeLifeProgress";
import {
  calculateShoeLife,
  ShoeLifeResult,
  SessionShoeData,
} from "@/utils/calculateShoeLife";
import useSyncSessionToDB from "@/utils/useSyncSessionToDB";
import { useEffect, useState } from "react";

export default function HomeClient() {
  const [shoeLife, setShoeLife] = useState<ShoeLifeResult | null>(null);
  const [oauthId, setOauthId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 신발 수명 계산
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);

      try {
        const response = await fetch("/api/me");
        const data = await response.json();

        if (data.oauthId) {
          setOauthId(data.oauthId);
        }

        const sessionResult = calculateShoeLife();

        if (sessionResult) {
          // 세션에 데이터가 있으면 그대로 사용
          setShoeLife(sessionResult);
        } else if (data.profile) {
          // 세션엔 없지만 DB에 데이터가 있으면 계산해서 사용
          const shoeData: SessionShoeData = {
            height: data.profile.height,
            weight: data.profile.weight,
            runningDistance: data.profile.running_distance,
            runningDistanceCustom: data.profile.running_distance_custom,
            runningType: data.profile.running_type,
            shoeAge: data.profile.shoe_age,
            shoeBrand: data.profile.shoe_brand,
            shoeModel: data.profile.shoe_model,
            updatedAt: data.profile.updated_at || data.profile.created_at,
            accumulatedDistance: data.profile.accumulated_distance || 0,
          };
          const result = calculateShoeLife(shoeData);
          setShoeLife(result);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  useSyncSessionToDB(oauthId);

  if (isLoading) return <Loading />;

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
