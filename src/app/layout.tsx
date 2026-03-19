import "@/styles/globals.css";
import MobileFrame from "@/components/common/MobileFrame";

export const metadata = {
  title: "ShoePlan",
  description: "Personalized Running Shoe life cycle management",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <MobileFrame>{children}</MobileFrame>
      </body>
    </html>
  );
}
