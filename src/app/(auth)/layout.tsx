import Link from "next/link";
import { BarChart3 } from "lucide-react";

const QUOTES = [
  "We replaced a $400/month tool with this and our CFO hasn't asked for a spreadsheet since.",
  "The budget utilization view alone saved us from two over-spends. Game changer.",
  "Setup was embarrassingly fast. Org created, team invited, first expense logged — under 10 minutes.",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: brand panel */}
      <div className="hidden lg:flex flex-col bg-slate-900 p-12 relative overflow-hidden">
        {/* Decorative gradients */}
        <div
          aria-hidden
          className="absolute top-0 left-0 right-0 h-px opacity-30"
          style={{ background: "linear-gradient(to right, transparent, #6366f1, transparent)" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 20% 80%, hsl(239 84% 20% / 0.5) 0%, transparent 60%)" }}
        />

        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-2.5 font-bold text-white text-lg w-fit">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-900/50">
            <BarChart3 className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          ExpenseTrack
        </Link>

        {/* Center content */}
        <div className="relative flex-1 flex flex-col justify-center">
          <div className="space-y-2 mb-10">
            <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              Used by 500+ teams
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-white leading-tight mb-6">
            Financial clarity starts<br/>with a single dashboard
          </h2>

          {/* Rotating quote */}
          <blockquote className="border-l-2 border-indigo-500/50 pl-5">
            <p className="text-slate-300 text-[15px] leading-relaxed">
              &ldquo;{QUOTES[0]}&rdquo;
            </p>
            <footer className="mt-3 text-slate-500 text-sm">
              <strong className="text-slate-400">Priya S.</strong> — Head of Finance, Gridline Labs
            </footer>
          </blockquote>
        </div>

        {/* Bottom stats */}
        <div className="relative grid grid-cols-3 gap-4 pt-8 border-t border-slate-800">
          {[
            { v: "$2.4M", l: "tracked this month" },
            { v: "99.9%", l: "uptime" },
            { v: "< 1s",  l: "avg page load" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-xl font-extrabold text-white">{s.v}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 font-bold text-slate-900 mb-8">
            <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            ExpenseTrack
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
