import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  spent: number;
  percentage: number;
  category: { name: string; color: string } | null;
}

interface Props {
  budgets: BudgetItem[];
}

export function BudgetOverview({ budgets }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Budget Overview</CardTitle>
          <CardDescription>Current period utilization</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/budgets" className="flex items-center gap-1 text-xs">
            Manage <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {budgets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No budgets set.{" "}
            <Link href="/budgets" className="text-primary hover:underline">Create one.</Link>
          </div>
        ) : (
          <div className="space-y-5">
            {budgets.map((b) => (
              <div key={b.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {b.percentage >= 90 && (
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    )}
                    <span className="font-medium">{b.name}</span>
                    {b.category && (
                      <span className="text-xs text-muted-foreground">({b.category.name})</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(b.spent)} / {formatCurrency(b.amount)}
                  </span>
                </div>
                <Progress
                  value={b.percentage}
                  className={cn(
                    "h-2",
                    b.percentage >= 90
                      ? "[&>div]:bg-red-500"
                      : b.percentage >= 75
                      ? "[&>div]:bg-amber-500"
                      : "[&>div]:bg-emerald-500"
                  )}
                />
                <p className="text-xs text-muted-foreground text-right">{b.percentage}% used</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
