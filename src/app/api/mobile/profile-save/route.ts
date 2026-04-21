import { NextResponse } from "next/server";
import { mobileSupabase } from "@/lib/mobileOauth";
import { getBearerToken, verifyMobileToken } from "@/lib/mobileToken";

const ALLOWED_FIELDS = [
  "runner_nickname",
  "motto",
  "height",
  "weight",
  "running_distance",
  "running_distance_custom",
  "running_type",
  "running_place",
  "shoe_pros",
  "shoe_cons",
  "shoe_age",
] as const;

export async function POST(request: Request) {
  try {
    const payload = verifyMobileToken(getBearerToken(request));

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const updatePayload: Record<string, unknown> = {
      oauth_id: payload.oauthId,
      updated_at: new Date().toISOString(),
    };

    for (const key of ALLOWED_FIELDS) {
      if (body[key] !== undefined) {
        updatePayload[key] = body[key];
      }
    }

    const { data, error } = await mobileSupabase
      .from("user_profile")
      .upsert(updatePayload, { onConflict: "oauth_id" })
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, profile: data });
  } catch (error) {
    console.error("Mobile profile save error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
