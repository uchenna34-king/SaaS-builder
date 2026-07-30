"use client";

import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid,
} from "recharts";

const SLIDES = [
  { id: "spend",      label: "Spending Trend"    },
  { id: "category",   label: "By Category"       },
  { id: "budget",     label: "Budget Status"     },
  { id: "monthly",    label: "Monthly Breakdown" },
];

const spendData = [
  { m: "Jan", v: 3200 }, { m: "Feb", v: 4100 }, { m: "Mar", v: 3600 },
  { m: "Apr", v: 5200 }, { m: "May", v: 4800 }, { m: "Jun", v: 6100 },
  { m: "Jul", v: 5400 }, { m: "Aug", v: 7200 },
];

const catData = [
  { name: "Payroll",    value: 42, color: "#6366f1" },
  { name: "Software",   value: 18, color: "#8b5cf6" },
  { name: "Office",     value: 14, color: "#10b981" },
  { name: "Travel",     value: 12, color: "#f59e0b" },
  { name: "Marketing",  value: 9,  color: "#ec4899" },
  { name: "Other",      value: 5,  color: "#94a3b8" },
];

const budgetData = [
  { name: "Payroll",   budget: 40000, spent: 38400, pct: 96 },
  { name: "Software",  budget: 8000,  spent: 5200,  pct: 65 },
  { name: "Travel",    budget: 6000,  spent: 4100,  pct: 68 },
  { name: "Marketing", budget: 5000,  spent: 4800,  pct: 96 },
  { name: "Office",    budget: 3000,  spent: 1200,  pct: 40 },
];

const monthlyData = [
  { m: "Mar", income: 68000, expenses: 41200 },
  { m: "Apr", income: 72000, expenses: 44800 },
  { m: "May", income: 69000, expenses: 38600 },
  { m: "Jun", income: 78000, expenses: 52300 },
  { m: "Jul", income: 81000, expenses: 49700 },
  { m: "Aug", income: 85000, expenses: 61200 },
];

const fmt = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;

function SpendSlide() {
  return (
    <div className="h-full flex flex-col gap-3">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Total spend</p>
          <p className="text-2xl font-bold text-slate-900 mt-0.5">$39,600</p>
        </div>
        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          ↑ 12.4% vs last period
        </span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={spendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={fmt} />
          <Tooltip
            formatter={(v: number) => [`$${v.toLocaleString()}`, "Spent"]}
            contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
          />
          <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={2.5} fill="url(#grad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function CategorySlide() {
  return (
    <div className="h-full flex gap-4 items-center">
      <ResponsiveContainer width="45%" height={180}>
        <PieChart>
          <Pie data={catData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={2} dataKey="value" strokeWidth={0}>
            {catData.map((e, i) => <Cell key={i} fill={e.color} />)}
          </Pie>
          <Tooltip formatter={(v: number) => [`${v}%`, ""]} contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex-1 space-y-2">
        {catData.map((c) => (
          <div key={c.name} className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ background: c.color }} />
            <span className="flex-1 text-slate-600">{c.name}</span>
            <span className="font-semibold text-slate-800">{c.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BudgetSlide() {
  return (
    <div className="h-full flex flex-col gap-2.5">
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Budget utilization · Aug 2026</p>
      {budgetData.map((b) => (
        <div key={b.name} className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-700 font-medium">{b.name}</span>
            <span className={`font-semibold ${b.pct >= 90 ? "text-red-500" : b.pct >= 70 ? "text-amber-500" : "text-emerald-600"}`}>
              {b.pct}%
            </span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${b.pct}%`,
                background: b.pct >= 90 ? "#ef4444" : b.pct >= 70 ? "#f59e0b" : "#10b981",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function MonthlySlide() {
  return (
    <div className="h-full flex flex-col gap-3">
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-indigo-500" />
          <span className="text-slate-500">Revenue</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-violet-300" />
          <span className="text-slate-500">Expenses</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={170}>
        <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={16} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={fmt} />
          <Tooltip
            formatter={(v: number, name: string) => [`$${v.toLocaleString()}`, name === "income" ? "Revenue" : "Expenses"]}
            contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
          />
          <Bar dataKey="income"   fill="#6366f1" radius={[3, 3, 0, 0]} />
          <Bar dataKey="expenses" fill="#c4b5fd" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const SLIDE_COMPONENTS = [SpendSlide, CategorySlide, BudgetSlide, MonthlySlide];

const MOCK_ROWS = [
  { label: "Vercel Pro",         cat: "Software",  amt: "$20",    dot: "bg-violet-500" },
  { label: "Team lunch",         cat: "Office",    amt: "$84",    dot: "bg-emerald-500" },
  { label: "Google Workspace",   cat: "Software",  amt: "$144",   dot: "bg-violet-500" },
  { label: "Flight SFO→NYC",    cat: "Travel",    amt: "$380",   dot: "bg-amber-500" },
];

export function ChartSlideshow() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animating, setAnimating] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = (next: number) => {
    setAnimating(true);
    setTimeout(() => {
      setActive(next);
      setAnimating(false);
    }, 200);
  };

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % SLIDES.length;
        advance(next);
        return prev;
      });
    }, 3200);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [paused]);

  const Slide = SLIDE_COMPONENTS[active];

  return (
    <div
      className="w-full max-w-3xl mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Browser chrome */}
      <div className="rounded-2xl overflow-hidden shadow-[0_24px_64px_-12px_rgb(99_102_241_/_0.25),0_8px_24px_-4px_rgb(0_0_0_/_0.12)] border border-slate-200/80">
        {/* Title bar */}
        <div className="bg-slate-100 px-4 py-3 flex items-center gap-3 border-b border-slate-200">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <div className="flex-1 mx-3">
            <div className="bg-white border border-slate-200 rounded-md px-3 py-1 text-xs text-slate-400 text-center max-w-xs mx-auto">
              app.expensetrack.io/dashboard
            </div>
          </div>
          <div className="flex gap-1.5 opacity-0">
            <span className="h-3 w-3 rounded-full bg-slate-300" />
          </div>
        </div>

        {/* App shell */}
        <div className="bg-white flex" style={{ height: 380 }}>
          {/* Mini sidebar */}
          <div className="w-44 border-r border-slate-100 flex flex-col py-4 px-3 shrink-0 bg-slate-50/60">
            <div className="flex items-center gap-2 px-1 mb-5">
              <div className="h-6 w-6 rounded-md bg-indigo-600 flex items-center justify-center shrink-0">
                <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v16a2 2 0 002 2h16M18 17V9M13 17V5M8 17v-3" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-slate-800">ExpenseTrack</span>
            </div>
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => advance(i)}
                className={`flex items-center gap-2 text-left px-2 py-1.5 rounded-md text-xs font-medium transition-colors mb-0.5 ${
                  active === i
                    ? "bg-indigo-600 text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${active === i ? "bg-indigo-200" : "bg-slate-300"}`} />
                {s.label}
              </button>
            ))}
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-1">
              {MOCK_ROWS.slice(0, 2).map((r) => (
                <div key={r.label} className="flex items-center gap-1.5 px-2 py-1">
                  <span className={`h-1.5 w-1.5 rounded-full ${r.dot}`} />
                  <span className="text-xs text-slate-400 truncate">{r.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Chart panel */}
            <div className="flex-1 p-5 border-b border-slate-100">
              <div
                className="h-full transition-opacity duration-200"
                style={{ opacity: animating ? 0 : 1 }}
              >
                <Slide />
              </div>
            </div>

            {/* Recent transactions strip */}
            <div className="px-5 py-2.5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Recent</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                {MOCK_ROWS.map((r) => (
                  <div key={r.label} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${r.dot}`} />
                      <span className="text-slate-600 truncate">{r.label}</span>
                    </div>
                    <span className="font-semibold text-slate-800 ml-2 shrink-0">{r.amt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => advance(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              active === i ? "w-6 bg-indigo-600" : "w-1.5 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
