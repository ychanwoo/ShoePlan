"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Loading from "@/components/common/Loading";

function KakaoCallbackContent() {
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
        credentials: "include",
      });

      if (res.ok) {
        localStorage.setItem("lastLoggedIn", "kakao");
        router.replace("/home");
      } else {
        alert("카카오 로그인 실패");
      }
    };

    login();
  }, [searchParams, router]);

  return <Loading />;
}

export default function KakaoCallbackPage() {
  return (
    <Suspense fallback={<Loading />}>
      <KakaoCallbackContent />
    </Suspense>
  );
}
