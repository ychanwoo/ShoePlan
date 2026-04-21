import { NextResponse } from "next/server";
import { mobileSupabase } from "@/lib/mobileOauth";
import { getBearerToken, verifyMobileToken } from "@/lib/mobileToken";

export async function GET(request: Request) {
  try {
    const payload = verifyMobileToken(getBearerToken(request));

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [{ data: profile, error: profileError }, { data: user, error: userError }] =
      await Promise.all([
        mobileSupabase
          .from("user_profile")
          .select("*")
          .eq("oauth_id", payload.oauthId)
          .maybeSingle(),
        mobileSupabase
          .from("users")
          .select("*")
          .eq("oauth_id", payload.oauthId)
          .maybeSingle(),
      ]);

    if (profileError) throw profileError;
    if (userError) throw userError;

    return NextResponse.json({
      oauthId: payload.oauthId,
      profile: profile ?? null,
      user: user ?? null,
    });
  } catch (error) {
    console.error("Mobile me error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
