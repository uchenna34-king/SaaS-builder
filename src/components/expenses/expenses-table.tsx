"use client";
import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Category } from "@prisma/client";
import type { ExpenseWithRelations } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Search, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useTransition } from "react";

const STATUS_STYLES = {
  PENDING: "warning" as const,
  APPROVED: "success" as const,
  REJECTED: "destructive" as const,
};

interface Props {
  expenses: ExpenseWithRelations[];
  categories: Category[];
  total: number;
  page: number;
  limit: number;
  searchParams: Record<string, string | undefined>;
}

export function ExpensesTable({ expenses, categories, total, page, limit, searchParams }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState<string | null>(null);

  function updateParam(key: string, value: string | null) {
    const newParams = new URLSearchParams(params.toString());
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    newParams.set("page", "1");
    startTransition(() => router.push(`${pathname}?${newParams.toString()}`));
  }

  async function deleteExpense(id: string) {
    setDeleting(id);
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    setDeleting(null);
    router.refresh();
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <Card>
      {/* Filters */}
      <div className="p-4 border-b flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            className="pl-9"
            defaultValue={searchParams.search ?? ""}
            onChange={(e) => updateParam("search", e.target.value || null)}
          />
        </div>
        <Select
          value={searchParams.categoryId ?? "all"}
          onValueChange={(v) => updateParam("categoryId", v === "all" ? null : v)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={searchParams.status ?? "all"}
          onValueChange={(v) => updateParam("status", v === "all" ? null : v)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">Title</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Category</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Amount</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    No expenses found.{" "}
                    <Link href="/expenses/new" className="text-primary hover:underline">
                      Add your first one.
                    </Link>
                  </td>
                </tr>
              )}
              {expenses.map((e) => (
                <tr key={e.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="font-medium">{e.title}</div>
                    {e.description && (
                      <div className="text-xs text-muted-foreground truncate max-w-xs">{e.description}</div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: e.category.color }}
                      />
                      {e.category.name}
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{formatDate(e.date)}</td>
                  <td className="p-4">
                    <Badge variant={STATUS_STYLES[e.status]} className="capitalize">
                      {e.status.toLowerCase()}
                    </Badge>
                  </td>
                  <td className="p-4 text-right font-semibold">{formatCurrency(Number(e.amount))}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 justify-end">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/expenses/${e.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteExpense(e.id)}
                        disabled={deleting === e.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={page <= 1}
                onClick={() => updateParam("page", String(page - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={page >= totalPages}
                onClick={() => updateParam("page", String(page + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
