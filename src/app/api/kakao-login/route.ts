import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  const { code } = await req.json();

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!);
    params.append("client_secret", process.env.KAKAO_CLIENT_SECRET!);
    params.append("redirect_uri", process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!);
    params.append("code", code);

    const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return NextResponse.json({ error: "토큰 실패" }, { status: 400 });
    }

    const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const kakaoUserData = await userRes.json();
    const kakaoUser = {
      oauth_id: String(kakaoUserData.id),
      email: kakaoUserData.kakao_account.email ?? null,
      nickname: kakaoUserData.properties.nickname ?? null,
      profile_image: kakaoUserData.properties.profile_image ?? null,
    };

    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("oauth_id", kakaoUser.oauth_id)
      .eq("provider", "kakao")
      .maybeSingle();

    let user;
    if (!existingUser) {
      // 신규 유저 생성
      const { data: newUser, error } = await supabase
        .from("users")
        .insert({
          ...kakaoUser,
          provider: "kakao",
        })
        .select()
        .single();

      if (error) throw error;
      user = newUser;
    } else {
      // 기존 유저 정보 업데이트
      const { data: updatedUser, error } = await supabase
        .from("users")
        .update({
          email: kakaoUser.email,
          nickname: kakaoUser.nickname,
          profile_image: kakaoUser.profile_image,
        })
        .eq("id", existingUser.id)
        .select()
        .single();

      if (error) throw error;
      user = updatedUser;
    }

    const response = NextResponse.json({ success: true, user });
    response.cookies.set("oauthId", user.oauth_id, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    response.cookies.set("provider", "kakao", {
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
