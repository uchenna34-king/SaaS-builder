"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface Props {
  data: Array<{ month: string; total: number }>;
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 shadow-card-md text-sm">
      <p className="text-slate-400 text-xs font-medium mb-1">{label}</p>
      <p className="font-bold text-slate-900">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export function SpendingChart({ data }: Props) {
  const max     = Math.max(...data.map((d) => d.total));
  const average = data.reduce((s, d) => s + d.total, 0) / (data.length || 1);
  const hasData = data.some((d) => d.total > 0);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-card">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[13px] font-medium text-slate-500">Spending trend</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">Last 6 months</p>
        </div>
        {hasData && (
          <div className="text-right">
            <p className="text-xs text-slate-400">Monthly avg</p>
            <p className="text-sm font-semibold text-slate-700 mt-0.5">{formatCurrency(average)}</p>
          </div>
        )}
      </div>

      {hasData ? (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            />
            <ReferenceLine
              y={average}
              stroke="#c7d2fe"
              strokeDasharray="4 4"
              strokeWidth={1}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#spendGrad)"
              dot={false}
              activeDot={{ r: 5, fill: "#6366f1", strokeWidth: 2, stroke: "white" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[220px] flex flex-col items-center justify-center text-slate-400">
          <p className="text-sm">No data yet — add your first expense.</p>
        </div>
      )}
    </div>
  );
}
