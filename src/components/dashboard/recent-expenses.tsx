import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import type { ExpenseWithRelations } from "@/types";

interface Props {
  expenses: ExpenseWithRelations[];
}

const statusVariant = {
  PENDING: "warning" as const,
  APPROVED: "success" as const,
  REJECTED: "destructive" as const,
};

export function RecentExpenses({ expenses }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>Latest 5 transactions</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/expenses" className="flex items-center gap-1 text-xs">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No expenses yet.{" "}
            <Link href="/expenses/new" className="text-primary hover:underline">Add your first one.</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map((e) => (
              <div key={e.id} className="flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: e.category.color }}
                >
                  {e.category.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{e.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {e.category.name} · {formatDateShort(e.date)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold">{formatCurrency(Number(e.amount))}</p>
                  <Badge variant={statusVariant[e.status]} className="text-xs">
                    {e.status.toLowerCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
