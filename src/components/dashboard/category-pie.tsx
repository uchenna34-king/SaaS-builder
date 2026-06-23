"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface Cat {
  categoryId:   string;
  categoryName: string;
  color:        string;
  total:        number;
  count:        number;
}

interface Props { data: Cat[] }

function CustomTooltip({ active, payload }: {
  active?: boolean;
  payload?: Array<{ payload: Cat }>;
}) {
  if (!active || !payload?.length) return null;
  const c = payload[0].payload;
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 shadow-card-md text-sm">
      <p className="font-semibold text-slate-900">{c.categoryName}</p>
      <p className="text-slate-500 text-xs mt-0.5">{formatCurrency(c.total)} · {c.count} expense{c.count !== 1 ? "s" : ""}</p>
    </div>
  );
}

export function CategoryPieChart({ data }: Props) {
  const total = data.reduce((s, d) => s + d.total, 0);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-card h-full flex flex-col">
      <div className="mb-4">
        <p className="text-[13px] font-medium text-slate-500">By category</p>
        <p className="text-xl font-bold text-slate-900 mt-0.5">This month</p>
      </div>

      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          No expenses this month
        </div>
      ) : (
        <>
          <div className="relative">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={54}
                  outerRadius={82}
                  paddingAngle={3}
                  dataKey="total"
                  strokeWidth={0}
                >
                  {data.map((e) => (
                    <Cell key={e.categoryId} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-[11px] text-slate-400 font-medium">Total</p>
              <p className="text-base font-bold text-slate-900">{formatCurrency(total)}</p>
            </div>
          </div>

          <div className="mt-3 space-y-2 overflow-y-auto">
            {data.slice(0, 5).map((c) => (
              <div key={c.categoryId} className="flex items-center gap-2.5 text-xs">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                <span className="flex-1 text-slate-600 truncate">{c.categoryName}</span>
                <span className="font-semibold text-slate-800">{formatCurrency(c.total)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
