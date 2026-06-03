import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3, Shield, Zap, Users, ArrowRight, CheckCircle2
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Real-time Dashboards",
    description: "Visualize spending patterns with interactive charts and month-over-month trends.",
  },
  {
    icon: Shield,
    title: "Multi-tenant Security",
    description: "Organization-level data isolation. Your data never crosses tenant boundaries.",
  },
  {
    icon: Zap,
    title: "Smart Budgets",
    description: "Set category or global budgets with automated utilization tracking and alerts.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Invite team members with role-based access: Owner, Admin, or Member.",
  },
];

const includedFeatures = [
  "Unlimited expenses",
  "Category management",
  "Budget tracking",
  "Monthly trend reports",
  "CSV export",
  "Team members (up to 5)",
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">ExpenseTrack</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get started free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-24 md:py-32">
          <div className="container text-center">
            <Badge variant="secondary" className="mb-6">
              Now in public beta
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
              Expense management built for{" "}
              <span className="text-primary">modern teams</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Track spending, manage budgets, and gain insights — all in one place.
              Built with multi-tenancy, real-time analytics, and role-based access from day one.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/register">
                  Start for free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">View demo dashboard</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 bg-muted/50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Everything you need to control spending</h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                From individual freelancers to growing teams — ExpenseTrack scales with you.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((f) => (
                <div key={f.title} className="bg-background rounded-xl p-6 border shadow-sm">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
              <p className="text-muted-foreground text-lg">Start free. Upgrade when you need more.</p>
            </div>
            <div className="max-w-sm mx-auto">
              <div className="border rounded-2xl p-8 shadow-lg relative">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
                  <div className="text-5xl font-extrabold mb-1">$0</div>
                  <p className="text-muted-foreground">forever, no credit card</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {includedFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" size="lg" asChild>
                  <Link href="/register">Get started free</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>ExpenseTrack © {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
