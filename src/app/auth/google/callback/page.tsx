"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Loading from "@/components/common/Loading";

function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;

    const login = async () => {
      const res = await fetch("/api/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        credentials: "include",
      });

      if (res.ok) {
        router.replace("/home");
      } else {
        alert("구글 로그인 실패");
      }
    };

    login();
  }, [searchParams, router]);

  return <Loading />;
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<Loading />}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
