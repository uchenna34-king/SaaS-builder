"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Props {
  monthlyData: Array<{ month: string; total: number; count: number }>;
  categoryData: Array<{ name: string; color: string; total: number; count: number }>;
  topExpenses: Array<{
    id: string;
    title: string;
    amount: number;
    date: Date;
    categoryName: string;
    categoryColor: string;
  }>;
}

export function ReportsClient({ monthlyData, categoryData, topExpenses }: Props) {
  const totalAllTime = monthlyData.reduce((sum, d) => sum + d.total, 0);
  const totalCount = monthlyData.reduce((sum, d) => sum + d.count, 0);
  const avgMonthly = monthlyData.length ? totalAllTime / monthlyData.filter((d) => d.total > 0).length : 0;

  return (
    <Tabs defaultValue="trends">
      <TabsList className="mb-4">
        <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
        <TabsTrigger value="categories">By Category</TabsTrigger>
        <TabsTrigger value="top">Top Expenses</TabsTrigger>
      </TabsList>

      <TabsContent value="trends" className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: "Total (12 months)", value: formatCurrency(totalAllTime) },
            { label: "Avg. per month", value: formatCurrency(avgMonthly) },
            { label: "Total transactions", value: totalCount.toLocaleString() },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending</CardTitle>
            <CardDescription>Last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} angle={-45} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), "Spent"]}
                  contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--background))" }}
                />
                <Bar dataKey="total" fill="hsl(243, 75%, 59%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="categories" className="space-y-4">
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>All-time spending by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="total" nameKey="name">
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [formatCurrency(v), "Total"]} contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--background))" }} />
                  <Legend formatter={(v) => <span className="text-xs">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryData.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: c.color }} />
                      <span>{c.name}</span>
                      <span className="text-muted-foreground">({c.count})</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(c.total)}</span>
                  </div>
                ))}
                {categoryData.length === 0 && (
                  <p className="text-muted-foreground text-sm text-center py-8">No data yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="top">
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Largest Expenses</CardTitle>
            <CardDescription>All-time highest individual expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topExpenses.map((e, i) => (
                <div key={e.id} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-5 text-right">{i + 1}.</span>
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: e.categoryColor }}
                  >
                    {e.categoryName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{e.title}</p>
                    <p className="text-xs text-muted-foreground">{e.categoryName} · {formatDate(e.date)}</p>
                  </div>
                  <span className="font-semibold text-sm">{formatCurrency(e.amount)}</span>
                </div>
              ))}
              {topExpenses.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-8">No expenses yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
