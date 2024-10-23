import ClientProvider from "@/lib/components/provider/clientProvider";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@/style/global.css";

export const metadata: Metadata = {
  title: "남지수 기술 블로그",
  description: "주니어 프론트 개발자의 성장 일지 | 개발 관련 기록",
  keywords: ["프론트엔드", "기술 블로그", "개발", "기록", "자기계발"],
  metadataBase: new URL(`${process.env.SERVER_URL}`),
  verification: { google: "00QzbWi0zlxqsygsgzV4unpH7HwdvieHl8XUCk7TMMY" },
  icons: {
    icon: "/profile/profile.ico",
  },
  openGraph: {
    type: "article",
    title: "남지수 기술 블로그",
    siteName: "남지수 기술 블로그",
    description: "주니어 프론트 개발자의 성장 일지 | 개발 관련 기록",
    images: [
      {
        url: "/thumbnails/geranimo-bKhETeDV1WM-unsplash.webp",
      },
    ],
    url: "/",
  },
};

export interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>
        <ClientProvider>
          <Analytics />
          <SpeedInsights />
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
