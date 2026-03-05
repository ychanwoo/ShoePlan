import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // 1. 쿠키에서 로그인 정보(oauthId) 확인
  const oauthId = request.cookies.get("oauthId")?.value;

  // 2. 사용자가 이동하려는 경로 확인
  const path = request.nextUrl.pathname;

  // 3. 로그인이 꼭 필요한 경로 목록
  const protectedRoutes = ["/home", "/stats", "/shoe", "/profile"];

  // 사용자가 가려는 경로가 로그인이 필요한 경로인지 확인
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route),
  );

  // 4. 보안구역 가려는데 oauthId 쿠키 없으면
  if (isProtectedRoute && !oauthId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 이미 로그인한 사용자가 login 페이지로 이동 시 /home으로 이동시킴
  if (path === "/login" && oauthId) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // 5. 문제가 없으면 통과
  return NextResponse.next();
}

// 6. 미들웨어가 감시할 경로 설정(성능 최적화)
export const config = {
  matcher: [
    /*
     * 아래 경로들은 굳이 감시할 필요가 없으므로 미들웨어를 실행하지 않습니다.
     * (API 라우트, Next.js 내부 파일, 이미지 등)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg).*)",
  ],
};
