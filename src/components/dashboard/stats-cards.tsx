import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, percentChange } from "@/lib/utils";
import { TrendingUp, TrendingDown, DollarSign, Receipt, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Props {
  totalExpenses: number;
  totalExpensesCount: number;
  monthlyExpenses: number;
  prevMonthExpenses: number;
}

export function DashboardStats({ totalExpenses, totalExpensesCount, monthlyExpenses, prevMonthExpenses }: Props) {
  const change = percentChange(monthlyExpenses, prevMonthExpenses);
  const isUp = change >= 0;

  const stats = [
    {
      title: "Total Expenses (All Time)",
      value: formatCurrency(totalExpenses),
      sub: `${totalExpensesCount} transactions`,
      icon: DollarSign,
      iconBg: "bg-blue-100 text-blue-600",
    },
    {
      title: "This Month",
      value: formatCurrency(monthlyExpenses),
      sub: (
        <span className={`flex items-center gap-1 text-xs ${isUp ? "text-red-500" : "text-emerald-500"}`}>
          {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(change)}% vs last month
        </span>
      ),
      icon: isUp ? TrendingUp : TrendingDown,
      iconBg: isUp ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Last Month",
      value: formatCurrency(prevMonthExpenses),
      sub: "Previous period",
      icon: Receipt,
      iconBg: "bg-purple-100 text-purple-600",
    },
    {
      title: "Avg. per Transaction",
      value: totalExpensesCount > 0 ? formatCurrency(totalExpenses / totalExpensesCount) : "$0.00",
      sub: "Across all time",
      icon: DollarSign,
      iconBg: "bg-amber-100 text-amber-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{s.title}</CardTitle>
            <div className={`h-9 w-9 rounded-full flex items-center justify-center ${s.iconBg}`}>
              <s.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
