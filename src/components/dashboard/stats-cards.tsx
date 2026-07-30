import { formatCurrency, percentChange } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, CalendarDays, Sigma } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  totalExpenses:     number;
  totalExpensesCount: number;
  monthlyExpenses:   number;
  prevMonthExpenses: number;
}

export function DashboardStats({ totalExpenses, totalExpensesCount, monthlyExpenses, prevMonthExpenses }: Props) {
  const delta   = percentChange(monthlyExpenses, prevMonthExpenses);
  const isUp    = delta >= 0;
  const avgTx   = totalExpensesCount > 0 ? totalExpenses / totalExpensesCount : 0;

  const cards = [
    {
      label:   "All-time spend",
      value:   formatCurrency(totalExpenses),
      sub:     `${totalExpensesCount.toLocaleString()} transactions`,
      icon:    DollarSign,
      gradient: "from-indigo-500 to-indigo-600",
      ring:    "ring-indigo-100",
    },
    {
      label:   "This month",
      value:   formatCurrency(monthlyExpenses),
      sub:     null,
      delta,
      isUp,
      icon:    CalendarDays,
      gradient: isUp ? "from-rose-500 to-rose-600" : "from-emerald-500 to-emerald-600",
      ring:    isUp ? "ring-rose-100" : "ring-emerald-100",
    },
    {
      label:   "Last month",
      value:   formatCurrency(prevMonthExpenses),
      sub:     "Previous period",
      icon:    TrendingUp,
      gradient: "from-violet-500 to-violet-600",
      ring:    "ring-violet-100",
    },
    {
      label:   "Avg. per expense",
      value:   formatCurrency(avgTx),
      sub:     "Across all time",
      icon:    Sigma,
      gradient: "from-amber-500 to-amber-600",
      ring:    "ring-amber-100",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card hover:shadow-card-md transition-shadow duration-200"
        >
          <div className="flex items-start justify-between mb-4">
            <p className="text-[13px] font-medium text-slate-500">{c.label}</p>
            <div className={cn(
              "h-9 w-9 rounded-xl bg-gradient-to-br flex items-center justify-center ring-4",
              c.gradient,
              c.ring
            )}>
              <c.icon className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
          </div>

          <p className="text-2xl font-bold text-slate-900 tracking-tight">{c.value}</p>

          <div className="mt-1.5 text-xs">
            {c.delta !== undefined ? (
              <span className={cn(
                "inline-flex items-center gap-0.5 font-medium",
                c.isUp ? "text-rose-500" : "text-emerald-600"
              )}>
                {c.isUp
                  ? <ArrowUpRight className="h-3.5 w-3.5" />
                  : <ArrowDownRight className="h-3.5 w-3.5" />
                }
                {Math.abs(c.delta)}% vs last month
              </span>
            ) : (
              <span className="text-slate-400">{c.sub}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
