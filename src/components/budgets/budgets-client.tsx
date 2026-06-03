"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Category } from "@prisma/client";
import { createBudgetSchema, type CreateBudgetInput } from "@/lib/validations/budget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Plus, Loader2, AlertTriangle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  spent: number;
  percentage: number;
  period: string;
  startDate: Date;
  endDate: Date | null;
  category: Category | null;
}

interface Props {
  budgets: BudgetItem[];
  categories: Category[];
}

export function BudgetsClient({ budgets, categories }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, reset, formState: { errors } } =
    useForm<CreateBudgetInput>({ resolver: zodResolver(createBudgetSchema) });

  async function onSubmit(data: CreateBudgetInput) {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);
    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Failed to create budget");
    } else {
      reset();
      setOpen(false);
      router.refresh();
    }
  }

  async function deleteBudget(id: string) {
    await fetch(`/api/budgets/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />New Budget</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Budget</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
              {error && <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">{error}</div>}
              <div className="space-y-1">
                <Label>Name *</Label>
                <Input placeholder="Monthly office budget" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Amount *</Label>
                  <Input type="number" step="0.01" placeholder="0.00" {...register("amount")} />
                  {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label>Period *</Label>
                  <Select onValueChange={(v) => setValue("period", v as CreateBudgetInput["period"])}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                      <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                      <SelectItem value="YEARLY">Yearly</SelectItem>
                      <SelectItem value="CUSTOM">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label>Category (optional)</Label>
                <Select onValueChange={(v) => setValue("categoryId", v === "all" ? undefined : v)}>
                  <SelectTrigger><SelectValue placeholder="All categories" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Start date *</Label>
                  <Input type="date" {...register("startDate")} />
                  {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label>End date</Label>
                  <Input type="date" {...register("endDate")} />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Budget
                </Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {budgets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-muted-foreground mb-4">No budgets created yet.</p>
            <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" />Create your first budget</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {budgets.map((b) => (
            <Card key={b.id} className={b.percentage >= 90 ? "border-red-200" : ""}>
              <CardHeader className="pb-3 flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {b.percentage >= 90 && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                    {b.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs capitalize">{b.period.toLowerCase()}</Badge>
                    {b.category && (
                      <Badge variant="outline" className="text-xs">{b.category.name}</Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground h-8 w-8"
                  onClick={() => deleteBudget(b.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Spent</span>
                  <span className="font-semibold">
                    {formatCurrency(b.spent)} <span className="text-muted-foreground font-normal">/ {formatCurrency(b.amount)}</span>
                  </span>
                </div>
                <Progress
                  value={b.percentage}
                  className={cn(
                    "h-2.5",
                    b.percentage >= 90 ? "[&>div]:bg-red-500" :
                    b.percentage >= 75 ? "[&>div]:bg-amber-500" :
                    "[&>div]:bg-emerald-500"
                  )}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{b.percentage}% used</span>
                  <span>{formatCurrency(Math.max(b.amount - b.spent, 0))} remaining</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
