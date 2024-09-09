import ReduxProvider from "@/lib/components/reduxProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/style/layout.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "기술블로그",
  description: "블로그 설명",
};

export interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ReduxProvider>
          <div className="contents">{children}</div>
        </ReduxProvider>
      </body>
    </html>
  );
}
