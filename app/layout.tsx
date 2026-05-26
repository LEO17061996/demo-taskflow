import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TaskFlow — Quản Lý Đơn Dịch Vụ Thông Minh",
  description:
    "Nền tảng SaaS giúp doanh nghiệp dịch vụ quản lý đơn hàng, nhân viên và lịch làm việc hiệu quả. Dùng thử miễn phí 14 ngày.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${inter.variable} ${jakarta.variable}`}>
      <body style={{ fontFamily: "var(--font-inter), sans-serif" }} className="antialiased">
        {children}
      </body>
    </html>
  );
}
