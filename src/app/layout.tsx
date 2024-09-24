import ClientProvider from "@/lib/components/provider/clientProvider";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import "@/style/global.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "기술블로그",
  description: "블로그 설명",
  other: {
    "google-site-verification": "00QzbWi0zlxqsygsgzV4unpH7HwdvieHl8XUCk7TMMY",
  },
};

export interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ClientProvider>
          <Analytics />
          <SpeedInsights />
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
