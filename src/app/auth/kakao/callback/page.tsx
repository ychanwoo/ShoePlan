"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function KakaoCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;

    const login = async () => {
      const res = await fetch("/api/kakao-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (res.ok) {
        router.replace("/home");
      } else {
        alert("카카오 로그인 실패");
      }
    };

    login();
  }, [searchParams, router]);

  return <div>카카오 로그인 처리중...</div>;
}
