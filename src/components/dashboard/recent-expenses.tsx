import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ExpenseWithRelations } from "@/types";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STATUS = {
  PENDING:  { label: "Pending",  classes: "bg-amber-50 text-amber-700 ring-1 ring-amber-200"  },
  APPROVED: { label: "Approved", classes: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  REJECTED: { label: "Rejected", classes: "bg-rose-50 text-rose-700 ring-1 ring-rose-200"     },
};

interface Props { expenses: ExpenseWithRelations[] }

export function RecentExpenses({ expenses }: Props) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-card flex flex-col">
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div>
          <p className="text-[13px] font-medium text-slate-500">Recent expenses</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">Latest activity</p>
        </div>
        <Link
          href="/expenses"
          className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {expenses.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center px-6">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
            <span className="text-2xl">🧾</span>
          </div>
          <p className="text-sm font-medium text-slate-700">No expenses yet</p>
          <p className="text-xs text-slate-400 mt-1 mb-4">Start tracking by logging your first expense.</p>
          <Link
            href="/expenses/new"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Add an expense →
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-slate-50">
          {expenses.map((e) => {
            const s = STATUS[e.status];
            return (
              <Link
                key={e.id}
                href={`/expenses/${e.id}`}
                className="flex items-center gap-3.5 px-6 py-3.5 hover:bg-slate-50/70 transition-colors group"
              >
                {/* Category avatar */}
                <div
                  className="h-9 w-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: e.category.color }}
                >
                  {e.category.name.slice(0, 2).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">
                    {e.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {e.category.name} · {formatDateShort(e.date)}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-[13.5px] font-bold text-slate-900">{formatCurrency(Number(e.amount))}</p>
                  <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-0.5 inline-block", s.classes)}>
                    {s.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
