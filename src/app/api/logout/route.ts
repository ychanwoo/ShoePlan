import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  const cookiesToDelete = [
    "oauthId",
    "userId",
    "provider",
    "nickname",
    "email",
    "profile_image",
  ];

  cookiesToDelete.forEach((name) => {
    response.cookies.set(name, "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });
  });

  return response;
}
