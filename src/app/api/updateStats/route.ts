import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

interface UpdatePayload {
  running_distance?: string;
  running_type?: string;
  shoe_brand?: string;
  shoe_model?: string;
  shoe_age?: string;
  updated_at?: string;
  accumulated_distance?: number;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const oauthId = cookieStore.get("oauthId")?.value;

    if (!oauthId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("user_profile")
      .select("running_distance, running_type, shoe_brand, shoe_model")
      .eq("oauth_id", oauthId)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const oauthId = cookieStore.get("oauthId")?.value;

    if (!oauthId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { data: oldData } = await supabase
      .from("user_profile")
      .select("*")
      .eq("oauth_id", oauthId)
      .single();

    let newAccumulatedDistance = Number(oldData?.accumulated_distance) || 0;

    const isShoeChanged =
      (body.brand && body.brand !== oldData?.shoe_brand) ||
      (body.model && body.model !== oldData?.shoe_model);

    if (isShoeChanged) {
      newAccumulatedDistance = 0;
    } else if (oldData) {
      const distMap: Record<string, number> = {
        "50km 미만": 25,
        "50~100km": 75,
        "100~200km": 150,
        "200~300km": 250,
        "300km 이상": 350,
      };
      const oldMonthlyDistance =
        oldData.running_distance === "직접입력"
          ? Number(oldData.running_distance_custom || 0)
          : distMap[oldData.running_distance] || 0;

      if (newAccumulatedDistance === 0 && oldData.shoe_age) {
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
        const oldMonthsUsed = monthMap[oldData.shoe_age] ?? 1;
        newAccumulatedDistance = oldMonthlyDistance * oldMonthsUsed;
      }

      const oldDailyDistance = oldMonthlyDistance / 30;

      //  마지막 저장일부터 오늘까지 며칠 지났는지 계산하는 로직
      let passedDays = 0;
      if (oldData.updated_at || oldData.created_at) {
        const lastSavedDate = new Date(
          oldData.updated_at || oldData.created_at,
        );
        const diffTime = new Date().getTime() - lastSavedDate.getTime();
        passedDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (passedDays < 0) passedDays = 0;
      }

      // 이전 누적 거리 + (예전 하루 주행거리 * 지난 일수)를 더함
      newAccumulatedDistance += oldDailyDistance * passedDays;
    }

    const updatePayload: UpdatePayload = {};

    if (body.distance !== undefined && body.distance !== "")
      updatePayload.running_distance = body.distance;
    if (body.type !== undefined && body.type !== "")
      updatePayload.running_type = body.type;
    if (body.brand !== undefined && body.brand !== "")
      updatePayload.shoe_brand = body.brand;
    if (body.model !== undefined && body.model !== "")
      updatePayload.shoe_model = body.model;
    if (body.shoeAge !== undefined && body.shoeAge !== "")
      updatePayload.shoe_age = body.shoeAge;

    updatePayload.accumulated_distance = newAccumulatedDistance;
    updatePayload.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from("user_profile")
      .update(updatePayload)
      .eq("oauth_id", oauthId);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
