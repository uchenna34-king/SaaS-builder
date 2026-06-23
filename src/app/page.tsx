import Link from "next/link";
import { ChartSlideshow } from "@/components/landing/chart-slideshow";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, BarChart3, ShieldCheck, Zap, Users2,
  ChevronRight, Star, CreditCard, TrendingUp, Receipt,
} from "lucide-react";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how",      label: "How it works" },
  { href: "#pricing",  label: "Pricing" },
];

const STATS = [
  { value: "500+",  label: "teams using it"        },
  { value: "$2.4M", label: "tracked this month"    },
  { value: "99.9%", label: "uptime"                 },
  { value: "< 1s",  label: "average page load"     },
];

const FEATURES = [
  {
    icon: BarChart3,
    color: "bg-indigo-50 text-indigo-600",
    title: "Live financial dashboards",
    body: "Area charts, pie charts, bar comparisons — all updating in real time. No more waiting for end-of-month reports to know where money is going.",
  },
  {
    icon: ShieldCheck,
    color: "bg-violet-50 text-violet-600",
    title: "Org-level data isolation",
    body: "Every workspace is completely separate. Your data never touches another tenant — enforced at the database query layer, not just the UI.",
  },
  {
    icon: Zap,
    color: "bg-amber-50 text-amber-600",
    title: "Budget alerts that actually fire",
    body: "Set limits per category or globally. Get warned at 75%, blocked at 100%. No more discovering you're over budget weeks later.",
  },
  {
    icon: Users2,
    color: "bg-emerald-50 text-emerald-600",
    title: "Role-based team access",
    body: "Owners approve, admins manage, members submit. Permissions enforced on every API route — not just hidden buttons in the UI.",
  },
  {
    icon: Receipt,
    color: "bg-pink-50 text-pink-600",
    title: "Full expense audit trail",
    body: "Every create, edit and status change is attributed to a user. Accountants and auditors love the clean paper trail.",
  },
  {
    icon: TrendingUp,
    color: "bg-sky-50 text-sky-600",
    title: "12-month trend reports",
    body: "Compare this month to last month, this quarter to last year. Spot the patterns before they become problems.",
  },
];

const HOW = [
  { n: "01", title: "Create your workspace",    body: "Sign up, get a personal org instantly. Invite your team in seconds." },
  { n: "02", title: "Set your categories",      body: "Use our defaults or build your own. Color-coded, icon-tagged." },
  { n: "03", title: "Log expenses as they happen", body: "Add amount, category, date. Submit a receipt. Done in under 30 seconds." },
  { n: "04", title: "Watch the numbers move",   body: "Your dashboard updates immediately. Charts shift. Budget bars fill." },
];

const TESTIMONIALS = [
  {
    body: "We replaced a $400/month tool with this and our finance team actually prefers it. The budget utilization view alone saved us from two over-spends.",
    name: "Priya S.",
    role: "Head of Finance · Gridline Labs",
    stars: 5,
  },
  {
    body: "The category breakdown chart in the dashboard finally answers the question our CFO asks every Monday. I haven't opened a spreadsheet since.",
    name: "Marcus T.",
    role: "Operations Lead · Fathom Studio",
    stars: 5,
  },
  {
    body: "Setup was embarrassingly fast. Org created, team invited, first expense logged — all in under 10 minutes.",
    name: "Dana K.",
    role: "Founder · Hollow Signal",
    stars: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* ── Navbar ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 glass border-b border-slate-200/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-slate-900">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
              <BarChart3 className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
            </div>
            ExpenseTrack
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login" className="text-slate-700">Sign in</Link>
            </Button>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm" asChild>
              <Link href="/register">
                Get started <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden hero-grid pt-20 pb-10 md:pt-28 md:pb-16">
          {/* Radial glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-30"
            style={{ background: "radial-gradient(ellipse at center, hsl(239 84% 67% / 0.18) 0%, transparent 70%)" }}
          />

          <div className="container relative text-center">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
              </span>
              Open beta · free for teams up to 5
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.05]">
              Stop guessing{" "}
              <span className="gradient-text">where the money went</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              ExpenseTrack gives your team real-time visibility into every dollar — with charts,
              budgets, and approval flows built for the way modern businesses actually work.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" className="h-12 px-7 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 text-base" asChild>
                <Link href="/register">
                  Start free today <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-7 text-base border-slate-200 hover:bg-slate-50" asChild>
                <Link href="/login">See a live demo</Link>
              </Button>
            </div>

            <p className="mt-4 text-xs text-slate-400">No credit card · No time limit · Cancel whenever</p>

            {/* Chart slideshow */}
            <div className="mt-16 animate-fade-in">
              <ChartSlideshow />
            </div>
          </div>
        </section>

        {/* ── Stats strip ─────────────────────────────────────────── */}
        <section className="border-y border-slate-100 bg-slate-50/60">
          <div className="container py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-slate-200">
              {STATS.map((s) => (
                <div key={s.label} className="text-center px-4">
                  <div className="text-2xl md:text-3xl font-extrabold text-slate-900">{s.value}</div>
                  <div className="text-sm text-slate-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────────── */}
        <section id="features" className="py-24">
          <div className="container">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">Built to last</p>
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                Everything your finance team needs
              </h2>
              <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
                Not a feature checklist — a toolkit that solves the actual problems.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-card-md transition-all duration-200"
                >
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────── */}
        <section id="how" className="py-24 bg-slate-900">
          <div className="container">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-3">Up and running fast</p>
              <h2 className="text-4xl font-extrabold text-white tracking-tight">
                From sign-up to insights in minutes
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {HOW.map((h, i) => (
                <div key={h.n} className="relative">
                  {i < HOW.length - 1 && (
                    <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-slate-700 to-transparent z-0" />
                  )}
                  <div className="relative z-10 p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                    <div className="text-3xl font-black text-indigo-500/40 mb-3 font-mono">{h.n}</div>
                    <h3 className="font-semibold text-white mb-2">{h.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{h.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ─────────────────────────────────────────── */}
        <section className="py-24">
          <div className="container">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                Teams that switched and stayed
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="p-6 rounded-2xl border border-slate-100 bg-white shadow-card">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed mb-5">&ldquo;{t.body}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ──────────────────────────────────────────────── */}
        <section id="pricing" className="py-24 bg-slate-50">
          <div className="container max-w-4xl">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">Pricing</p>
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">One plan. No tricks.</h2>
              <p className="mt-4 text-slate-500">Everything you need, free forever for small teams. Upgrade when you grow.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Free */}
              <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-card">
                <div className="mb-6">
                  <h3 className="font-bold text-xl text-slate-900">Free</h3>
                  <div className="flex items-end gap-1 mt-3">
                    <span className="text-5xl font-black text-slate-900">$0</span>
                    <span className="text-slate-400 mb-1.5">/mo</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">For individuals and small teams</p>
                </div>
                <ul className="space-y-2.5 mb-8 text-sm text-slate-600">
                  {[
                    "Up to 5 team members",
                    "Unlimited expenses",
                    "10 active budgets",
                    "12-month reports",
                    "Category management",
                    "Role-based access",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <svg className="h-4 w-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/register">Get started free</Link>
                </Button>
              </div>

              {/* Pro */}
              <div className="p-8 rounded-2xl bg-indigo-600 border border-indigo-500 shadow-[0_8px_30px_rgb(99_102_241_/_0.35)] relative overflow-hidden">
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-20"
                  style={{ background: "radial-gradient(ellipse at top right, white, transparent 60%)" }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-xl text-white">Pro</h3>
                    <span className="text-xs font-semibold bg-white/20 text-white px-2.5 py-1 rounded-full">Coming soon</span>
                  </div>
                  <div className="flex items-end gap-1 mt-3">
                    <span className="text-5xl font-black text-white">$19</span>
                    <span className="text-indigo-200 mb-1.5">/mo per workspace</span>
                  </div>
                  <p className="text-sm text-indigo-200 mt-2">For teams that need more</p>
                  <ul className="space-y-2.5 my-8 text-sm text-indigo-100">
                    {[
                      "Unlimited team members",
                      "Receipt storage (50 GB)",
                      "Stripe invoice matching",
                      "Custom approval workflows",
                      "CSV & API export",
                      "Priority support",
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-2.5">
                        <svg className="h-4 w-4 text-indigo-300 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-white text-indigo-700 hover:bg-indigo-50" asChild>
                    <Link href="/register">Join the waitlist</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────── */}
        <section className="py-24">
          <div className="container text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight max-w-2xl mx-auto">
              Your next expense report starts here
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-lg mx-auto">
              Join 500+ teams who stopped fighting spreadsheets and started actually understanding their numbers.
            </p>
            <Button size="lg" className="mt-10 h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 text-base" asChild>
              <Link href="/register">
                Create free workspace <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 py-10 bg-white">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-semibold text-slate-700">
            <BarChart3 className="h-4 w-4 text-indigo-600" />
            ExpenseTrack
          </Link>
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} ExpenseTrack. Built with care.</p>
          <div className="flex items-center gap-5 text-sm text-slate-400">
            <Link href="#" className="hover:text-slate-700 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-slate-700 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-slate-700 transition-colors">Status</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
