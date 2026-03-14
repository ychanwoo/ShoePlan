"use client";

import Image from "next/image";
import LogoImg from "@/assets/logo.svg";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SplashScreen() {
  const router = useRouter();

  // oauthID확인 후 /home or /start
  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      const timer = new Promise((resolve) => setTimeout(resolve, 2500));

      const authCheck = fetch("/api/login-check");

      try {
        const [, response] = await Promise.all([timer, authCheck]);

        if (response.ok) {
          router.replace("/home");
        } else {
          router.replace("/start");
        }
      } catch (error) {
        console.log("oauthID 확인 불가", error);
        router.replace("/start");
      }
    };
    checkAuthAndNavigate();
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
