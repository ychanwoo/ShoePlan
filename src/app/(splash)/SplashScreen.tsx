"use client";

import Image from "next/image";
import LogoImg from "@/assets/logo.svg";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SplashScreen() {
  const router = useRouter();

  // 2.5초 후 start 페이지로 이동
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/start");
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex justify-center">
      <Image
        src={LogoImg}
        alt="Logo-image"
        width={300}
        height={300}
        className="animate-fade-scale"
      />
    </div>
  );
}
