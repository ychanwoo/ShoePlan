import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  const { code, state } = await req.json();

  try {
    // code -> access_token
    const tokenRes = await fetch(
      `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&client_secret=${process.env.NAVER_CLIENT_SECRET}&code=${code}&state=${state}`,
    );

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return NextResponse.json({ error: "토큰 실패" }, { status: 400 });
    }

    // 사용자 정보 요청
    const userRes = await fetch("https://openapi.naver.com/v1/nid/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userRes.json();
    const naverUser = userData.response;

    // 기존 유저 확인 (DB에서)
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", naverUser.email)
      .single();

    let user;

    if (!existingUser) {
      // 신규 유저 저장
      const { data: newUser, error } = await supabase
        .from("users")
        .insert({
          email: naverUser.email,
          nickname: naverUser.nickname,
          profile_image: naverUser.profile_image,
          provider: "naver",
        })
        .select()
        .single();

      if (error) throw error;
      user = newUser;
    } else {
      user = existingUser;
    }

    // 여기서 JWT 발급하거나 세션 생성하면 됨
    const response = NextResponse.json({ success: true });

    response.cookies.set("userId", user.id, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1일
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
