import "@/styles/globals.css";
import MobileFrame from "@/components/common/MobileFrame";
import { Viewport } from "next";
import Image from "next/image";

export const metadata = {
  title: "ShoePlan",
  description: "Personalized Running Shoe life cycle management",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#2F3941",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-[#343C47] min-h-dvh overflow-x-hidden relative">
        <div className="hidden md:block fixed inset-0 z-0 pointer-events-none">
          {/* Left */}
          <div className="absolute left-10 top-20 opacity-10 select-none">
            <h1 className="text-8xl font-black text-white italic">
              SHOE
              <br />
              PLAN
            </h1>
          </div>

          <div className="absolute left-10 bottom-16 select-none flex flex-col items-center gap-3 pointer-events-auto">
            <p className="text-white/50 text-sm font-bold tracking-widest uppercase">
              Scan to Start
            </p>
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
              <Image
                width={128}
                height={128}
                src="/shoeplan-qr.jpg"
                alt="ShoePlan App QR Code"
                className="w-32 h-32 object-cover rounded-xl"
              />
            </div>
          </div>

          {/* Right */}
          <div className="absolute right-20 top-40 text-right opacity-20 select-none">
            <p className="text-2xl font-bold text-white mb-2">RUNNING LOG</p>
            <p className="text-2xl font-bold text-white mb-2">RUNNING LIFE</p>
            <p className="text-2xl font-bold text-white">SMART ANALYTICS</p>
          </div>

          <div className="absolute -right-10 -bottom-10 w-162 opacity-40 select-none mix-blend-lighten">
            <Image
              width={650}
              height={650}
              src="/rootImage.png"
              alt="Shoe Schematic Blueprint"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* 메인 모바일 프레임 콘텐츠 */}
        <div className="relative z-10">
          <MobileFrame>{children}</MobileFrame>
        </div>
      </body>
    </html>
  );
}
