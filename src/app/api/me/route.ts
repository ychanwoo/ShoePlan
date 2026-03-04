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
    return NextResponse.json({ oauthId: null, profile: null, user: null });
  }

  // 1. user_profile 테이블에서 러닝 관련 데이터 가져오기
  const { data: profile, error: profileError } = await supabase
    .from("user_profile")
    .select("*")
    .eq("oauth_id", oauthId)
    .single();

  if (profileError) {
    console.error("Error fetching user_profile:", profileError);
  }

  // 2. users 테이블에서 이메일, 프로필 이미지, provider 정보 가져오기
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("oauth_id", oauthId) // users 테이블의 고유 id 컬럼과 비교
    .single();

  if (userError) {
    console.error("Error fetching users DB:", userError);
  }

  return NextResponse.json({
    oauthId,
    profile: profile || null,
    user: user || null,
  });
}
