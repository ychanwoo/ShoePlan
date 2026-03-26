// * 임시 더미 데이터 (추후 API 연동 예정)

export const BRANDS = ["Nike", "Adidas", "Asics", "New Balance"];

export const MODELS: Record<(typeof BRANDS)[number], string[]> = {
  Nike: ["Pegasus", "Vomero", "Zoom Fly", "Vaporfly", "Alphafly"],
  Adidas: [
    "Supernova Rise",
    "Adizero Boston",
    "Adizero Adios Pro 3",
    "Adizero EVO SL",
    "Adizero Adios Pro 4",
  ],
  Puma: [
    "Velocity Nitro",
    "Deviate Nitro",
    "Deviate Nitro Elite",
    "Fast-R Nitro Elite",
  ],
  "New Balance": [
    "Fresh Foam X 1080",
    "FuelCell SC Trainer",
    "FuelCell Rebel",
    "FuelCell SC Elite",
    "FuelCell SC Pacer",
  ],
  Asics: ["Gel-Kayano", "Novablast", "Superblast", "Magic Speed", "Metaspeed"],
  Mizuno: [
    "Wave Inspire",
    "Neo Vista",
    "Wave Rebellion Flash 2",
    "Wave Rebellion Pro 2",
  ],
  Hoka: ["Bondi", "Clifton", "Mach X2", "Skyward X", "Mach 6", "Rocket X2"],
  Saucony: ["Endorphin Speed 4", "Endorphin Pro 4", "Endorphin Elite"],
  On: [
    "Cloudmonster",
    "Cloudmonster Hyper",
    "Cloudsurfer Next",
    "Cloudboom Max",
    "Cloudboom Strike",
  ],
};

export const DISTANCE_OPTIONS = [
  "50km 미만",
  "50~100km",
  "100~200km",
  "200~300km",
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
