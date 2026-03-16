"use client";

import HeaderBar from "@/components/common/HeaderBar";
import TabBar from "@/components/common/TabBar";
import RecommendStepOnePage from "@/components/recommend-step/recommendStepOne";
import RecommendStepThreePage from "@/components/recommend-step/recommendStepThree";
import RecommendStepTwoPage from "@/components/recommend-step/recommendStepTwo";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RecommendPage() {
  const router = useRouter();
  const [recommendStep, setRecommendStep] = useState(1);
  const [surveyData, setSurveyData] = useState({
    runningPlace: "",
    shoeCons: [] as string[],
  });

  const next = () => setRecommendStep((s) => Math.min(s + 1, 3));
  const prev = () => setRecommendStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (finalPros: string[]) => {
    try {
      const res = await fetch("/api/updateStats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          runningPlace: surveyData.runningPlace,
          shoeCons: surveyData.shoeCons,
          shoePros: finalPros,
        }),
      });

      if (res.ok) {
        router.push("/shoe/recommend/result");
      } else {
        alert("데이터 저장 실패");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("서버와 통신 중 오류 발생");
    }
  };

  return (
    <>
      <HeaderBar title="Recommend" />

      {recommendStep == 1 && (
        <RecommendStepOnePage
          onNext={next}
          onPrev={prev}
          onSelect={(val) =>
            setSurveyData((prev) => ({ ...prev, runningPlace: val }))
          }
        />
      )}
      {recommendStep == 2 && (
        <RecommendStepTwoPage
          onNext={next}
          onPrev={prev}
          onSelect={(vals) =>
            setSurveyData((prev) => ({ ...prev, shoeCons: vals }))
          }
        />
      )}
      {recommendStep == 3 && (
        <RecommendStepThreePage
          onNext={next}
          onPrev={prev}
          onSelect={(vals) => handleSubmit(vals)}
        />
      )}

      <TabBar />
    </>
  );
}
