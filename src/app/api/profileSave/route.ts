import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: Request) {
  try {
    // 로그인된 사용자 쿠키에서 oauthId 가져오기
    const cookieStore = cookies();
    const oauthId = (await cookieStore).get("oauthId")?.value;

    if (!oauthId) {
      return NextResponse.json(
        { message: "로그인이 필요합니다." },
        { status: 401 },
      );
    }

    // 프론트엔드에서 보낸 데이터(nickname, motto) 받기
    const body = await request.json();
    const { runner_nickname, motto } = body;

    // Supabase user_profile 테이블 업데이트
    const { error } = await supabase
      .from("user_profile")
      .update({
        runner_nickname: runner_nickname,
        motto: motto,
      })
      .eq("oauth_id", oauthId);

    if (error) {
      console.error("Supabase Update Error:", error);
      return NextResponse.json(
        { message: "데이터베이스 저장 중 오류가 발생했습니다." },
        { status: 500 },
      );
    }

    // 성공 응답 보내기
    return NextResponse.json(
      { message: "프로필이 성공적으로 업데이트되었습니다." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Profile update API error:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
