import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const oauthId = (await cookieStore).get("oauthId")?.value;

  return NextResponse.json({ oauthId: oauthId ?? null });
}
