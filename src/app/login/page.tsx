"use client";

import Image from "next/image";
import LogoImg from "@/assets/logo.svg";
import { GoogleLoginBtn } from "@/components/common/GoogleLoginBtn";
import { KakaoLoginBtn } from "@/components/common/KakaoLoginBtn";
import { NaverLoginBtn } from "@/components/common/NaverLoginBtn";

export default function LoginPage() {
  // * 임시 코드 /home경로로 이동하는 흐름 파악 위해 작성 (추후 제거)
  return (
    <>
      <div className="pb-70">
        <div className="flex justify-center relative top-50">
          <Image src={LogoImg} alt="Logo-image" width={300} height={300} />
        </div>

        <p className="text-[#CBD5E1] text-sm text-center relative top-45">
          1분만에 로그인 하기
        </p>

        <div className="space-y-6">
          {/* 임시로 카카오 버튼 클릭 시 home 경로로 이동 */}
          <KakaoLoginBtn />
          <GoogleLoginBtn />
          <NaverLoginBtn />
        </div>
      </div>
    </>
  );
}
