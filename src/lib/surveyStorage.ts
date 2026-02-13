export type SurveyData = {
  height?: number; // Step1
  weight?: number; // Step1
  runningDistance?: string; // Step2
  runningDistanceCustom?: string; // Step2 직접입력
  runningType?: string; // Step3
  shoeBrand?: string; // Step4
  shoeModel?: string; // Step4
  shoeAge?: string; // Step5
};

export const getSurveyData = (): SurveyData => {
  if (typeof window === "undefined") return {};
  return JSON.parse(
    sessionStorage.getItem("inputDataBeforeLogin") || "{}",
  ) as SurveyData;
};

export const setSurveyData = (newData: Partial<SurveyData>) => {
  if (typeof window === "undefined") return;
  const current = getSurveyData();
  sessionStorage.setItem(
    "inputDataBeforeLogin",
    JSON.stringify({ ...current, ...newData }),
  );
};

export const clearSurveyData = () => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("inputDataBeforeLogin");
};
