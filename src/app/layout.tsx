import "@/styles/globals.css";
import MobileFrame from "@/components/common/MobileFrame";

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
