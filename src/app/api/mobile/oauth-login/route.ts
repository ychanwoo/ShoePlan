import { NextResponse } from "next/server";
import { exchangeProviderCode } from "@/lib/mobileOauth";
import {
  decodeMobileOauthState,
  isMobileOauthState,
  type MobileOauthProvider,
} from "@/lib/mobileState";
import { signMobileToken } from "@/lib/mobileToken";

function isProvider(value: unknown): value is MobileOauthProvider {
  return value === "google" || value === "kakao" || value === "naver";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const provider = body.provider;
    const code = typeof body.code === "string" ? body.code : "";
    const rawState = typeof body.state === "string" ? body.state : "";
    const mobileState = decodeMobileOauthState(rawState);

    if (!isProvider(provider) || !code) {
      return NextResponse.json(
        { error: "Invalid mobile OAuth request." },
        { status: 400 },
      );
    }

    if (!isMobileOauthState(mobileState, provider)) {
      return NextResponse.json(
        { error: "Invalid mobile OAuth state." },
        { status: 400 },
      );
    }

    const user = await exchangeProviderCode(provider, code, rawState);
    const mobileToken = signMobileToken(user.oauth_id, provider);

    return NextResponse.json({
      success: true,
      mobileToken,
      provider,
      user,
    });
  } catch (error) {
    console.error("Mobile OAuth login error:", error);
    return NextResponse.json(
      { error: "Mobile OAuth login failed." },
      { status: 500 },
    );
  }
}
