"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function NaverCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code) return;

    const login = async () => {
      const res = await fetch("/api/naver-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, state }),
        credentials: "include",
      });

      if (res.ok) {
        router.replace("/home");
      } else {
        alert("네이버 로그인 실패");
      }
    };

    login();
  }, [searchParams, router]);

  return <div>네이버 로그인 처리중...</div>;
}
