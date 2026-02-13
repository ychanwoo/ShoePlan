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
    params.append("client_id", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!);
    params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET!);
    params.append("redirect_uri", process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!);
    params.append("code", code);

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return NextResponse.json({ error: "토큰 실패" }, { status: 400 });
    }

    const userRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      },
    );
    const googleUser = await userRes.json();

    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", googleUser.email)
      .single();

    let user;
    if (!existingUser) {
      const { data: newUser, error } = await supabase
        .from("users")
        .insert({
          email: googleUser.email,
          nickname: googleUser.name,
          profile_image: googleUser.picture,
          provider: "google",
        })
        .select()
        .single();
      if (error) throw error;
      user = newUser;
    } else {
      user = existingUser;
    }

    const response = NextResponse.json({ success: true, user });
    response.cookies.set("userId", user.id, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    response.cookies.set("provider", "google", {
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
