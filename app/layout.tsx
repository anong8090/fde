// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FDE 国企智能审批提效平台 · 中润农垦演示中心",
  description: "面向国企食品加工厂业务场景的 AI 合规穿透与审批风控协同演示系统"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
