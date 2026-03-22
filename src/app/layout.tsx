import "@/styles/globals.css";
import MobileFrame from "@/components/common/MobileFrame";
import { Viewport } from "next";

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
      <body className="bg-[#374151]">
        <MobileFrame>{children}</MobileFrame>
      </body>
    </html>
  );
}
