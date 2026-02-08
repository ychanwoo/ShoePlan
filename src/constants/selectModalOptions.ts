// * 임시 더미 데이터 (추후 API 연동 예정)

export const BRANDS = ["Nike", "Adidas", "Asics", "New Balance"];

export const MODELS: Record<(typeof BRANDS)[number], string[]> = {
  Nike: ["Pegasus", "Vaporfly", "Invincible"],
  Adidas: ["Adizero Boston", "Adios Pro"],
  Asics: ["Nimbus", "Kayano", "Magic Speed", "Meta Speed"],
  "New Balance": ["1080", "FuelCell Rebel"],
};

export const DISTANCE_OPTIONS = [
  "20km 미만",
  "20~50km",
  "50~100km",
  "100~300km",
  "300km 이상",
];

export const RUNNING_TYPE_OPTIONS = [
  "LSD (Long Slow Distance)",
  "Tempo Run",
  "Interval Training / Race",
  "Mixed Running",
];

export type Brand = (typeof BRANDS)[number];
export type Model = (typeof MODELS)[Brand][number];
export type Distance = (typeof DISTANCE_OPTIONS)[number];
export type RunningType = (typeof RUNNING_TYPE_OPTIONS)[number];
