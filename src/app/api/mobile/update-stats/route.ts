import { NextResponse } from "next/server";
import { mobileSupabase } from "@/lib/mobileOauth";
import { getBearerToken, verifyMobileToken } from "@/lib/mobileToken";

interface UserProfileRow {
  accumulated_distance?: number | null;
  created_at?: string | null;
  is_running?: boolean | null;
  running_distance?: string | null;
  running_distance_custom?: number | null;
  shoe_age?: string | null;
  shoe_brand?: string | null;
  shoe_model?: string | null;
  updated_at?: string | null;
}

const DIST_MAP: Record<string, number> = {
  "50km 미만": 25,
  "50~100km": 75,
  "100~200km": 150,
  "200~300km": 250,
  "300km 이상": 350,
};

const MONTH_MAP: Record<string, number> = {
  "0개월": 0,
  "1개월": 1,
  "3개월": 3,
  "6개월": 6,
  "9개월": 9,
  "12개월": 12,
  "18개월": 18,
  "24개월 이상": 24,
};

function resolveMonthlyDistance(row: UserProfileRow | null) {
  if (!row?.running_distance) return 0;
  if (row.running_distance === "직접입력") {
    return Number(row.running_distance_custom || 0);
  }
  return DIST_MAP[row.running_distance] || 0;
}

function calculateAccumulatedDistance(
  oldData: UserProfileRow | null,
  body: Record<string, unknown>,
) {
  let nextDistance = Number(oldData?.accumulated_distance) || 0;
  const brand = typeof body.brand === "string" ? body.brand : "";
  const model = typeof body.model === "string" ? body.model : "";
  const isShoeChanged =
    (brand && brand !== oldData?.shoe_brand) ||
    (model && model !== oldData?.shoe_model);

  if (isShoeChanged) return 0;
  if (!oldData) return nextDistance;

  const oldMonthlyDistance = resolveMonthlyDistance(oldData);

  if (nextDistance === 0 && oldData.shoe_age) {
    nextDistance = oldMonthlyDistance * (MONTH_MAP[oldData.shoe_age] ?? 1);
  }

  if (oldData.is_running !== false && (oldData.updated_at || oldData.created_at)) {
    const lastSavedDate = new Date(oldData.updated_at || oldData.created_at!);
    const diffTime = Date.now() - lastSavedDate.getTime();
    const passedDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    nextDistance += (oldMonthlyDistance / 30) * passedDays;
  }

  return Math.round(nextDistance);
}

function setIfPresent(
  updatePayload: Record<string, unknown>,
  key: string,
  value: unknown,
) {
  if (value !== undefined && value !== "") {
    updatePayload[key] = value;
  }
}

async function getProfile(oauthId: string) {
  const { data, error } = await mobileSupabase
    .from("user_profile")
    .select("*")
    .eq("oauth_id", oauthId)
    .maybeSingle();

  if (error) throw error;
  return data as UserProfileRow | null;
}

export async function GET(request: Request) {
  try {
    const payload = verifyMobileToken(getBearerToken(request));

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ data: await getProfile(payload.oauthId) });
  } catch (error) {
    console.error("Mobile stats get error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = verifyMobileToken(getBearerToken(request));

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const oldData = await getProfile(payload.oauthId);
    const updatePayload: Record<string, unknown> = {
      oauth_id: payload.oauthId,
      accumulated_distance: calculateAccumulatedDistance(oldData, body),
      updated_at: new Date().toISOString(),
    };

    setIfPresent(updatePayload, "running_distance", body.distance);
    setIfPresent(updatePayload, "running_type", body.type);
    setIfPresent(updatePayload, "shoe_brand", body.brand);
    setIfPresent(updatePayload, "shoe_model", body.model);
    setIfPresent(updatePayload, "shoe_age", body.shoeAge);
    setIfPresent(updatePayload, "running_place", body.runningPlace);

    if (body.isRunning !== undefined) {
      updatePayload.is_running = body.isRunning;
    }
    if (Array.isArray(body.shoePros) && body.shoePros.length > 0) {
      updatePayload.shoe_pros = body.shoePros;
    }
    if (Array.isArray(body.shoeCons) && body.shoeCons.length > 0) {
      updatePayload.shoe_cons = body.shoeCons;
    }

    const { data, error } = await mobileSupabase
      .from("user_profile")
      .upsert(updatePayload, { onConflict: "oauth_id" })
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, profile: data });
  } catch (error) {
    console.error("Mobile stats update error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
