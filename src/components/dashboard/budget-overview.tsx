import Link from "next/link";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

interface BudgetItem {
  id:         string;
  name:       string;
  amount:     number;
  spent:      number;
  percentage: number;
  category:   { name: string; color: string } | null;
}

interface Props { budgets: BudgetItem[] }

function pctColor(pct: number) {
  if (pct >= 90) return { bar: "bg-rose-500",    text: "text-rose-600"   };
  if (pct >= 75) return { bar: "bg-amber-500",   text: "text-amber-600"  };
  return                { bar: "bg-emerald-500", text: "text-emerald-600" };
}

export function BudgetOverview({ budgets }: Props) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-card flex flex-col">
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div>
          <p className="text-[13px] font-medium text-slate-500">Budget tracker</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">Current period</p>
        </div>
        <Link
          href="/budgets"
          className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          Manage <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {budgets.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center px-6">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
            <span className="text-2xl">🎯</span>
          </div>
          <p className="text-sm font-medium text-slate-700">No budgets yet</p>
          <p className="text-xs text-slate-400 mt-1 mb-4">Set spending limits to keep your team on track.</p>
          <Link
            href="/budgets"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Create a budget →
          </Link>
        </div>
      ) : (
        <div className="px-6 pb-6 space-y-5">
          {budgets.map((b) => {
            const { bar, text } = pctColor(b.percentage);
            const remaining     = Math.max(b.amount - b.spent, 0);
            return (
              <div key={b.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    {b.percentage >= 90 && (
                      <AlertTriangle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    )}
                    <span className="text-[13.5px] font-semibold text-slate-800 truncate">{b.name}</span>
                    {b.category && (
                      <span className="text-xs text-slate-400 shrink-0">({b.category.name})</span>
                    )}
                  </div>
                  <span className={cn("text-xs font-bold shrink-0 ml-2", text)}>
                    {b.percentage}%
                  </span>
                </div>

                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", bar)}
                    style={{ width: `${b.percentage}%` }}
                  />
                </div>

                <div className="flex justify-between mt-1.5 text-xs text-slate-400">
                  <span>{formatCurrency(b.spent)} spent</span>
                  <span>{formatCurrency(remaining)} left</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
