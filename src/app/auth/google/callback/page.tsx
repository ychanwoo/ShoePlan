"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Loading from "@/components/common/Loading";
import { decodeMobileOauthState, isMobileOauthState } from "@/lib/mobileState";

function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    if (!code) return;

    const login = async () => {
      const mobileState = decodeMobileOauthState(state);

      if (isMobileOauthState(mobileState, "google")) {
        const res = await fetch("/api/mobile/oauth-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider: "google", code, state }),
        });
        const data = await res.json();
        const callbackUrl = new URL(mobileState!.appRedirect!);

        if (res.ok && data.mobileToken) {
          callbackUrl.searchParams.set("mobileToken", data.mobileToken);
          callbackUrl.searchParams.set("provider", "google");
        } else {
          callbackUrl.searchParams.set(
            "error_description",
            data.error ?? "구글 로그인 실패",
          );
        }

        window.location.replace(callbackUrl.toString());
        return;
      }

      const res = await fetch("/api/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        credentials: "include",
      });

      if (res.ok) {
        localStorage.setItem("lastLoggedIn", "google");
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
