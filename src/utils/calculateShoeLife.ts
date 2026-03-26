export interface SessionShoeData {
  height: number;
  weight: number;
  runningDistance: string;
  runningDistanceCustom?: string;
  runningType: string;
  shoeAge: string;
  shoeBrand: string;
  shoeModel: string;
  updatedAt?: string;
  accumulatedDistance: number;
  isRunning?: boolean;
}

export interface ShoeLifeResult {
  recommendedLife: number;
  usedDistance: number;
  usagePercent: number;
  remainingMonths: number;
}

export function calculateShoeLife(
  inputData?: SessionShoeData | null,
): ShoeLifeResult | null {
  let data: SessionShoeData | null = null;

  if (inputData) {
    data = inputData;
  } else {
    const stored =
      typeof window !== "undefined"
        ? sessionStorage.getItem("inputDataBeforeLogin")
        : null;
    if (stored) {
      data = JSON.parse(stored);
    }
  }

  if (!data) return null;

  /* -------------------------------
     모델 기본 수명
  -------------------------------- */
  const modelBaseLife: Record<string, number> = {
    // Nike
    Pegasus: 700,
    Vomero: 750,
    "Zoom Fly": 600,
    Vaporfly: 400,
    Alphafly: 350,

    // Adidas
    "Adizero Boston": 650,
    "Adizero Adios Pro 3": 400,
    "Adizero EVO SL": 550,
    "Adizero Adios Pro 4": 400,
    "Supernova Rise": 700,

    // Puma
    "Velocity Nitro": 700,
    "Deviate Nitro": 600,
    "Deviate Nitro Elite": 400,
    "Fast-R Nitro Elite": 350,

    // New Balance
    "Fresh Foam X 1080": 750,
    "FuelCell SC Trainer": 650,
    "FuelCell Rebel": 550,
    "FuelCell SC Elite": 400,
    "FuelCell SC Pacer": 350,

    // Asics
    "Gel-Kayano": 800,
    Novablast: 700,
    Superblast: 650,
    "Magic Speed": 500,
    Metaspeed: 400,

    // Mizuno
    "Wave Inspire": 750,
    "Neo Vista": 650,
    "Wave Rebellion Flash 2": 500,
    "Wave Rebellion Pro 2": 400,

    // Hoka
    Bondi: 750,
    Clifton: 700,
    "Mach X2": 550,
    "Skyward X": 650,
    "Mach 6": 550,
    "Rocket X2": 400,

    // Saucony
    "Endorphin Speed 4": 600,
    "Endorphin Pro 4": 400,
    "Endorphin Elite": 350,

    // On
    Cloudmonster: 700,
    "Cloudmonster Hyper": 600,
    "Cloudsurfer Next": 700,
    "Cloudboom Max": 400,
    "Cloudboom Strike": 350,
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
     월간 러닝 거리 & 일일 러닝 거리
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

  const dailyDistance = monthlyDistance / 30;

  /* -------------------------------
     누적 거리
  -------------------------------- */
  let baseAccumulated = data.accumulatedDistance;

  // DB에 저장된 누적 거리가 없으면 처음 설정한 (월간거리 * 개월수)로 계산
  if (
    baseAccumulated === undefined ||
    baseAccumulated === null ||
    baseAccumulated === 0
  ) {
    const monthMap: Record<string, number> = {
      "0개월": 0,
      "1개월": 1,
      "3개월": 3,
      "6개월": 6,
      "9개월": 9,
      "12개월": 12,
      "18개월": 18,
      "24개월 이상": 24,
    };
    const monthsUsed = monthMap[data.shoeAge] ?? 1;
    baseAccumulated = monthlyDistance * monthsUsed;
  }

  /* -------------------------------
     날짜 차이 계산
  -------------------------------- */
  let passedDays = 0;
  if (data.updatedAt && data.isRunning !== false) {
    const lastSavedDate = new Date(data.updatedAt);
    const today = new Date();

    const diffTime = today.getTime() - lastSavedDate.getTime();
    passedDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (passedDays < 0) passedDays = 0;
  }

  /* -------------------------------
     총 사용 거리 (과거 누적 거리 + 새로운 설정으로 달린 거리)
  -------------------------------- */
  // 방금 위에서 구한 baseAccumulated에 추가 거리를 더해줌
  const usedDistance = baseAccumulated + dailyDistance * passedDays;

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

  /* -------------------------------
     하루 감소량 콘솔 로그 추가
  -------------------------------- */
  const dailyPercentDecrease = (dailyDistance / recommendedLife) * 100;

  console.log(`
    [러닝화 수명 일일 계산 리포트]
    --------------------------
    - 모델명: ${data.shoeModel}
    - 총 권장 수명: ${recommendedLife}km
    - 일일 예상 주행거리: ${dailyDistance.toFixed(2)}km
    - 하루 평균 감소율: ${dailyPercentDecrease.toFixed(2)}%
    - 마지막 업데이트로부터 경과일: ${passedDays}일
    - 총 추가 차감 거리: ${(dailyDistance * passedDays).toFixed(2)}km
    --------------------------
  `);

  return {
    recommendedLife,
    usedDistance: Math.round(usedDistance),
    usagePercent: remainingPercent,
    remainingMonths,
  };
}
