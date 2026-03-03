import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET() {
  const cookieStore = cookies();
  const oauthId = (await cookieStore).get("oauthId")?.value;

  if (!oauthId) {
    return NextResponse.json({ oauthId: null, profile: null });
  }

  // DB에서 사용자 프로필 데이터 가져오기
  const { data: profile, error } = await supabase
    .from("user_profile")
    .select("*")
    .eq("oauth_id", oauthId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ oauthId, profile: null });
  }

  return NextResponse.json({ oauthId, profile });
}
