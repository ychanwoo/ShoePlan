"use client";

import Image from "next/image";
import LogoImg from "@/assets/logo.svg";
import { GoogleLoginBtn } from "@/components/button/GoogleLoginBtn";
import { KakaoLoginBtn } from "@/components/button/KakaoLoginBtn";
import { NaverLoginBtn } from "@/components/button/NaverLoginBtn";
import { useEffect, useState } from "react";
import RecentLoginBubble from "@/components/common/RecentLoginBubble";

export default function LoginPage() {
  const [lastLoggedIn, setLastLoggedIn] = useState<string | null>(null);

  useEffect(() => {
    const savedLoginMethod = localStorage.getItem("lastLoggedIn");
    if (savedLoginMethod) {
      setLastLoggedIn(savedLoginMethod);
    }
  }, []);
  return (
    <>
      <div className="login-page">
        <div className="login-logo-wrap flex justify-center relative top-42">
          <Image
            src={LogoImg}
            alt="Logo-image"
            width={340}
            height={340}
            className="login-logo"
          />
        </div>

        <p className="login-subtitle text-[#CBD5E1] text-sm text-center relative top-45">
          1분만에 로그인 하기
        </p>

        <div className="login-buttons space-y-6 relative w-full mt-[clamp(12rem,26vh,15rem)]">
          {/* 카카오 */}
          <div className="relative w-75 mx-auto">
            {lastLoggedIn === "kakao" && <RecentLoginBubble />}
            <KakaoLoginBtn />
          </div>

          {/* 구글 */}
          <div className="relative w-75 mx-auto">
            {lastLoggedIn === "google" && <RecentLoginBubble />}
            <GoogleLoginBtn />
          </div>

          {/* 네이버 */}
          <div className="relative w-75 mx-auto">
            {lastLoggedIn === "naver" && <RecentLoginBubble />}
            <NaverLoginBtn />
          </div>
        </div>
      </div>
    </>
  );
}
