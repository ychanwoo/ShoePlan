import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

interface UserProfileRow {
  weight: number | null;
  running_distance: string | null;
  running_distance_custom: string | number | null;
  running_type: string | null;
  shoe_age: string | null;
  shoe_model: string | null;
  accumulated_distance: number | null;
  updated_at?: string | null;
  created_at?: string | null;
  is_running?: boolean | null;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const distanceMap: Record<string, number> = {
  "50km 미만": 25,
  "50~100km": 75,
  "100~200km": 150,
  "200~300km": 250,
  "300km 이상": 350,
};

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

const modelBaseLife: Record<string, number> = {
  Pegasus: 700,
  Vomero: 750,
  "Zoom Fly": 600,
  Vaporfly: 400,
  Alphafly: 350,
  "Adizero Boston": 650,
  "Adizero Adios Pro 3": 400,
  "Adizero EVO SL": 550,
  "Adizero Adios Pro 4": 400,
  "Supernova Rise": 700,
  "Velocity Nitro": 700,
  "Deviate Nitro": 600,
  "Deviate Nitro Elite": 400,
  "Fast-R Nitro Elite": 350,
  "Fresh Foam X 1080": 750,
  "FuelCell SC Trainer": 650,
  "FuelCell Rebel": 550,
  "FuelCell SC Elite": 400,
  "FuelCell SC Pacer": 350,
  "Gel-Kayano": 800,
  Novablast: 700,
  Superblast: 650,
  "Magic Speed": 500,
  Metaspeed: 400,
  "Wave Inspire": 750,
  "Neo Vista": 650,
  "Wave Rebellion Flash 2": 500,
  "Wave Rebellion Pro 2": 400,
  Bondi: 750,
  Clifton: 700,
  "Mach X2": 550,
  "Skyward X": 650,
  "Mach 6": 550,
  "Rocket X2": 400,
  "Endorphin Speed 4": 600,
  "Endorphin Pro 4": 400,
  "Endorphin Elite": 350,
  Cloudmonster: 700,
  "Cloudmonster Hyper": 600,
  "Cloudsurfer Next": 700,
  "Cloudboom Max": 400,
  "Cloudboom Strike": 350,
};

const runningTypeLabels = [
  "LSD",
  "Tempo Run",
  "Interval",
  "Mixed running",
] as const;

function normalizeRunningType(type: string | null) {
  if (!type) return "미입력";
  const normalized = type.trim().toLowerCase();

  if (normalized.includes("lsd")) return "LSD";
  if (normalized.includes("tempo")) return "Tempo Run";
  if (normalized.includes("interval") || normalized.includes("race")) {
    return "Interval";
  }
  if (normalized.includes("mixed")) return "Mixed running";

  return type.trim();
}

function getMonthlyDistance(profile: UserProfileRow) {
  if (profile.running_distance === "직접입력") {
    return Number(profile.running_distance_custom ?? 0);
  }

  return distanceMap[profile.running_distance ?? ""] ?? 0;
}

function getRecommendedLife(profile: UserProfileRow) {
  let recommendedLife = modelBaseLife[profile.shoe_model ?? ""] ?? 650;
  const weight = Number(profile.weight ?? 0);

  if (weight >= 85) recommendedLife *= 0.85;
  else if (weight >= 75) recommendedLife *= 0.9;
  else if (weight > 0 && weight <= 55) recommendedLife *= 1.05;

  const runningType = normalizeRunningType(profile.running_type);

  if (runningType === "Interval") recommendedLife *= 0.9;
  else if (runningType === "Tempo Run") recommendedLife *= 0.95;
  else if (runningType === "LSD") recommendedLife *= 1.05;

  return Math.round(recommendedLife);
}

function getUsedDistance(profile: UserProfileRow) {
  const monthlyDistance = getMonthlyDistance(profile);
  let usedDistance = Number(profile.accumulated_distance ?? 0);

  if (!usedDistance) {
    usedDistance = monthlyDistance * (monthMap[profile.shoe_age ?? ""] ?? 1);
  }

  if (profile.is_running !== false && (profile.updated_at || profile.created_at)) {
    const lastSavedDate = new Date(profile.updated_at ?? profile.created_at ?? "");
    const diffTime = Date.now() - lastSavedDate.getTime();
    const passedDays = Math.max(
      0,
      Math.floor(diffTime / (1000 * 60 * 60 * 24)),
    );

    usedDistance += (monthlyDistance / 30) * passedDays;
  }

  return Math.round(usedDistance);
}

function getRiskLevel(profile: UserProfileRow) {
  const recommendedLife = getRecommendedLife(profile);
  const usedDistance = getUsedDistance(profile);
  const ratio = recommendedLife > 0 ? usedDistance / recommendedLife : 0;

  if (ratio >= 0.8) return "replace";
  if (ratio >= 0.5) return "caution";
  return "safe";
}

function getMode(values: string[]) {
  const counts = values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});

  return (
    Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "데이터 없음"
  );
}

function getDistanceMidpoint(distanceRange: string) {
  return distanceMap[distanceRange] ?? 0;
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("user_profile")
      .select(
        "weight,running_distance,running_distance_custom,running_type,shoe_age,shoe_model,accumulated_distance,updated_at,created_at,is_running",
      );

    if (error) throw error;

    const profiles = (data ?? []) as UserProfileRow[];
    const totalUsers = profiles.length;
    const usedDistances = profiles.map(getUsedDistance);
    const usagePercents = profiles.map((profile) => {
      const recommendedLife = getRecommendedLife(profile);
      const usedDistance = getUsedDistance(profile);

      return recommendedLife > 0 ? (usedDistance / recommendedLife) * 100 : 0;
    });
    const averageAccumulatedDistance = totalUsers
      ? Math.round(
          usedDistances.reduce((sum, distance) => sum + distance, 0) /
            totalUsers,
        )
      : 0;
    const averageUsagePercent = totalUsers
      ? Math.round(
          usagePercents.reduce((sum, percent) => sum + percent, 0) /
            totalUsers,
        )
      : 0;
    const riskCounts = profiles.reduce(
      (acc, profile) => {
        acc[getRiskLevel(profile)] += 1;
        return acc;
      },
      { caution: 0, replace: 0, safe: 0 },
    );
    const runningTypeCounts = profiles.reduce<Record<string, number>>(
      (acc, profile) => {
        const type = normalizeRunningType(profile.running_type);
        acc[type] = (acc[type] ?? 0) + 1;
        return acc;
      },
      Object.fromEntries(runningTypeLabels.map((label) => [label, 0])),
    );
    const distanceMode = getMode(
      profiles
        .map((profile) => profile.running_distance)
        .filter((distance): distance is string => Boolean(distance)),
    );

    return NextResponse.json({
      averageAccumulatedDistance,
      averageUsagePercent,
      distanceMode,
      monthlyMileageMode: getDistanceMidpoint(distanceMode),
      riskCounts,
      runningTypeCounts,
      totalUsers,
      warningUsers: riskCounts.caution + riskCounts.replace,
    });
  } catch (error) {
    console.error("Shoe insights error:", error);
    return NextResponse.json(
      { error: "Failed to load shoe insights" },
      { status: 500 },
    );
  }
}
