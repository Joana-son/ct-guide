import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CT검사 가이드 | SMC",
  description: "CT검사 전 과정을 이해하고 준비할 수 있도록 안내해드립니다.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
