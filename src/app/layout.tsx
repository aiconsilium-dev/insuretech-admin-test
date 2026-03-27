import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InsureTech - 보험 심사 시스템",
  description: "보험 청구 심사 및 관리 시스템",
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
