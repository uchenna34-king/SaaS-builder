import Link from "next/link";
import { BarChart3 } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Branding panel */}
      <div className="hidden lg:flex flex-col bg-primary p-10 text-primary-foreground">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <BarChart3 className="h-6 w-6" />
          ExpenseTrack
        </Link>
        <div className="flex-1 flex flex-col justify-center">
          <blockquote className="space-y-4">
            <p className="text-2xl font-semibold leading-relaxed">
              &ldquo;Finally a tool that gives our finance team the visibility they need without the enterprise price tag.&rdquo;
            </p>
            <footer className="text-primary-foreground/70">
              <strong>Sarah M.</strong> — Finance Director, TechCorp
            </footer>
          </blockquote>
        </div>
        <div className="text-primary-foreground/60 text-sm">
          Trusted by 500+ teams worldwide
        </div>
      </div>
      {/* Form panel */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 font-bold text-xl mb-8">
            <BarChart3 className="h-6 w-6 text-primary" />
            ExpenseTrack
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
