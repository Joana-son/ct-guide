import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://ct-guide.smcradiology.workers.dev";
const previewImage = `${siteUrl}/ct-guide-machine.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "CT검사 가이드 | SMC",
  description: "CT검사 전 과정을 이해하고 준비할 수 있도록 안내해드립니다.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    title: "CT검사 가이드 | SMC",
    description: "CT검사 전 과정을 이해하고 준비할 수 있도록 안내해드립니다.",
    siteName: "SMC CT검사 안내",
    images: [
      {
        url: previewImage,
        width: 1231,
        height: 927,
        alt: "CT 검사 장비",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CT검사 가이드 | SMC",
    description: "CT검사 전 과정을 이해하고 준비할 수 있도록 안내해드립니다.",
    images: [previewImage],
  },
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
