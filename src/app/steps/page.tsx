"use client";
import StepFivePage from "@/components/step-before-login/stepFive";
import StepFourPage from "@/components/step-before-login/stepFour";
import StepOnePage from "@/components/step-before-login/stepOne";
import StepThreePage from "@/components/step-before-login/stepThree";
import StepTwoPage from "@/components/step-before-login/stepTwo";
import { useState } from "react";

export default function StepsPage() {
  const [step, setStep] = useState(1);

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <>
      {step === 1 && <StepOnePage onNext={next} onPrev={prev} />}
      {step === 2 && <StepTwoPage onNext={next} onPrev={prev} />}
      {step === 3 && <StepThreePage onNext={next} onPrev={prev} />}
      {step === 4 && <StepFourPage onNext={next} onPrev={prev} />}
      {step === 5 && <StepFivePage onNext={next} onPrev={prev} />}
    </>
  );
}
