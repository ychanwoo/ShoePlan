import { createClient } from "@supabase/supabase-js";
import type { MobileOauthProvider } from "@/lib/mobileState";

export interface ShoePlanUser {
  email: string | null;
  id?: string | number;
  nickname: string | null;
  oauth_id: string;
  profile_image: string | null;
  provider: MobileOauthProvider;
}

export const mobileSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function upsertUser(user: ShoePlanUser) {
  const { data: existingUser, error: existingError } = await mobileSupabase
    .from("users")
    .select("*")
    .eq("oauth_id", user.oauth_id)
    .eq("provider", user.provider)
    .maybeSingle();

  if (existingError) throw existingError;

  if (!existingUser) {
    const { data, error } = await mobileSupabase
      .from("users")
      .insert(user)
      .select()
      .single();
    if (error) throw error;
    return data as ShoePlanUser;
  }

  const { data, error } = await mobileSupabase
    .from("users")
    .update({
      email: user.email,
      nickname: user.nickname,
      profile_image: user.profile_image,
    })
    .eq("id", existingUser.id)
    .select()
    .single();

  if (error) throw error;
  return data as ShoePlanUser;
}

export async function ensureMobileProfile(oauthId: string) {
  const { error } = await mobileSupabase
    .from("user_profile")
    .upsert({ oauth_id: oauthId }, { onConflict: "oauth_id" });

  if (error) throw error;
}

async function exchangeGoogleCode(code: string) {
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
  if (!tokenData.access_token) throw new Error("Google token exchange failed.");

  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const googleUser = await userRes.json();

  return upsertUser({
    oauth_id: String(googleUser.id),
    email: googleUser.email ?? null,
    nickname: googleUser.name ?? null,
    profile_image: googleUser.picture ?? null,
    provider: "google",
  });
}

async function exchangeKakaoCode(code: string) {
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
  if (!tokenData.access_token) throw new Error("Kakao token exchange failed.");

  const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const kakaoUserData = await userRes.json();

  return upsertUser({
    oauth_id: String(kakaoUserData.id),
    email: kakaoUserData.kakao_account?.email ?? null,
    nickname: kakaoUserData.properties?.nickname ?? null,
    profile_image: kakaoUserData.properties?.profile_image ?? null,
    provider: "kakao",
  });
}

async function exchangeNaverCode(code: string, state: string) {
  const tokenParams = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID!,
    client_secret: process.env.NAVER_CLIENT_SECRET!,
    code,
    state,
  });
  const tokenRes = await fetch(
    `https://nid.naver.com/oauth2.0/token?${tokenParams.toString()}`,
  );
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) throw new Error("Naver token exchange failed.");

  const userRes = await fetch("https://openapi.naver.com/v1/nid/me", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const userData = await userRes.json();
  const naverUser = userData.response;

  return upsertUser({
    oauth_id: String(naverUser.id),
    email: naverUser.email ?? null,
    nickname: naverUser.name ?? null,
    profile_image: naverUser.profile_image ?? null,
    provider: "naver",
  });
}

export async function exchangeProviderCode(
  provider: MobileOauthProvider,
  code: string,
  state = "",
) {
  const user =
    provider === "google"
      ? await exchangeGoogleCode(code)
      : provider === "kakao"
        ? await exchangeKakaoCode(code)
        : await exchangeNaverCode(code, state);

  await ensureMobileProfile(user.oauth_id);
  return user;
}
