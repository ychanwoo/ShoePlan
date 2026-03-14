import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// 로그인 전 oauthID 여부 확인
export async function GET() {
  const cookieStore = await cookies();
  const oauthId = cookieStore.get("oauthId")?.value;

  if (oauthId) return NextResponse.json({ isLoggedIn: true }, { status: 200 });

  return NextResponse.json({ isLoggedIn: false }, { status: 401 });
}
