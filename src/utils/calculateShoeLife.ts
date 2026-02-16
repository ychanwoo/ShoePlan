export interface SessionShoeData {
  height: number;
  weight: number;
  runningDistance: string;
  runningDistanceCustom?: string;
  runningType: string;
  shoeAge: string;
  shoeBrand: string;
  shoeModel: string;
}

export interface ShoeLifeResult {
  recommendedLife: number; // 총 권장 수명 km
  usedDistance: number; // 현재까지 사용 km
  usagePercent: number; // 사용률 %
  remainingMonths: number; // 남은 개월 수
}

export function calculateShoeLife(): ShoeLifeResult | null {
  if (typeof window === "undefined") return null;

  const stored = sessionStorage.getItem("inputDataBeforeLogin");
  if (!stored) return null;

  const data: SessionShoeData = JSON.parse(stored);

  /* -------------------------------
     모델 기본 수명
  -------------------------------- */
  const modelBaseLife: Record<string, number> = {
    Pegasus: 650,
    Vaporfly: 400,
    Invincible: 700,

    "Adizero Boston": 600,
    "Adios Pro": 420,

    Nimbus: 750,
    Kayano: 750,
    "Magic Speed": 500,
    "Meta Speed": 450,

    "1080": 750,
    "FuelCell Rebel": 500,

    EndorphinSpeed: 500,
    Triumph: 700,
  };

  let recommendedLife = modelBaseLife[data.shoeModel] ?? 650;

  /* -------------------------------
     체중 보정
  -------------------------------- */
  let weightFactor = 1;

  if (data.weight >= 85) weightFactor = 0.85;
  else if (data.weight >= 75) weightFactor = 0.9;
  else if (data.weight <= 55) weightFactor = 1.05;

  recommendedLife *= weightFactor;

  /* -------------------------------
     러닝 타입 보정
  -------------------------------- */
  let typeFactor = 1;

  if (data.runningType === "Interval") typeFactor = 0.9;
  else if (data.runningType === "Tempo Run") typeFactor = 0.95;
  else if (data.runningType === "LSD") typeFactor = 1.05;

  recommendedLife *= typeFactor;
  recommendedLife = Math.round(recommendedLife);

  /* -------------------------------
     월간 러닝 거리
  -------------------------------- */
  const distanceMap: Record<string, number> = {
    "50km 미만": 25,
    "50~100km": 75,
    "100~200km": 150,
    "200~300km": 250,
    "300km 이상": 350,
  };

  const monthlyDistance =
    data.runningDistance === "직접입력"
      ? Number(data.runningDistanceCustom ?? 0)
      : (distanceMap[data.runningDistance] ?? 0);

  /* -------------------------------
     사용 개월
  -------------------------------- */
  const monthMap: Record<string, number> = {
    "1개월": 1,
    "3개월": 3,
    "6개월": 6,
    "9개월": 9,
    "12개월": 12,
    "18개월": 18,
    "24개월 이상": 24,
  };

  const monthsUsed = monthMap[data.shoeAge] ?? 1;

  /* -------------------------------
     총 사용 거리
  -------------------------------- */
  const usedDistance = monthlyDistance * monthsUsed;

  /* -------------------------------
     남은 거리 계산
  -------------------------------- */
  const remainingKm = recommendedLife - usedDistance;

  const isExceeded = remainingKm <= 0;

  /* -------------------------------
     사용률 계산
  -------------------------------- */
  const usagePercent = isExceeded
    ? 100
    : Math.round((usedDistance / recommendedLife) * 100);
  const remainingPercent = isExceeded ? 0 : 100 - usagePercent;

  /* -------------------------------
     남은 개월 계산 (초과 시 0 처리)
  -------------------------------- */
  const remainingMonths =
    !isExceeded && monthlyDistance > 0
      ? Math.ceil(remainingKm / monthlyDistance)
      : 0;

  return {
    recommendedLife,
    usedDistance,
    usagePercent: remainingPercent,
    remainingMonths,
  };
}
