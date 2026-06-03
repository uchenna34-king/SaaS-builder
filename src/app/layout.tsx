import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ExpenseTrack — Smart SaaS Expense Management",
    template: "%s | ExpenseTrack",
  },
  description: "Track, categorize and analyze your business expenses with real-time dashboards and budget controls.",
  keywords: ["expense tracker", "budget management", "financial dashboard", "SaaS"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
