import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { auth } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ExpenseTrack — Smart SaaS Expense Management",
    template: "%s | ExpenseTrack",
  },
  description: "Track, categorize and analyze your business expenses with real-time dashboards and budget controls.",
  keywords: ["expense tracker", "budget management", "financial dashboard", "SaaS"],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Read the session once on the server and hand it to the client provider so it
  // doesn't refetch /api/auth/session on the client. JWT strategy → no DB hit.
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
