"use client";

import HeaderBar from "@/components/common/HeaderBar";
import TabBar from "@/components/common/TabBar";
import RecommendStepOnePage from "@/components/recommend-step/recommendStepOne";
import RecommendStepThreePage from "@/components/recommend-step/recommendStepThree";
import RecommendStepTwoPage from "@/components/recommend-step/recommendStepTwo";
import { useState } from "react";

export default function RecommendPage() {
  const [recommendStep, setRecommendStep] = useState(1);

  const next = () => setRecommendStep((s) => Math.min(s + 1, 3));
  const prev = () => setRecommendStep((s) => Math.max(s - 1, 1));
  return (
    <>
      <HeaderBar title="Recommend" />

      {recommendStep == 1 && (
        <RecommendStepOnePage onNext={next} onPrev={prev} />
      )}
      {recommendStep == 2 && (
        <RecommendStepTwoPage onNext={next} onPrev={prev} />
      )}
      {recommendStep == 3 && (
        <RecommendStepThreePage onNext={next} onPrev={prev} />
      )}

      <TabBar />
    </>
  );
}
