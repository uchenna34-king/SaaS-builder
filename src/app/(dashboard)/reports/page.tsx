import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ReportsClient } from "@/components/reports/reports-client";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export const metadata: Metadata = { title: "Reports" };

export default async function ReportsPage() {
  const session = await auth();
  const member = await db.organizationMember.findFirst({
    where: { userId: session!.user!.id! },
    orderBy: { createdAt: "asc" },
  });

  if (!member) return null;
  const orgId = member.organizationId;
  const now = new Date();

  // Last 12 months trend
  const monthlyData = await Promise.all(
    Array.from({ length: 12 }, (_, i) => {
      const d = subMonths(now, 11 - i);
      return db.expense
        .aggregate({
          where: {
            organizationId: orgId,
            date: { gte: startOfMonth(d), lte: endOfMonth(d) },
          },
          _sum: { amount: true },
          _count: true,
        })
        .then((agg) => ({
          month: format(d, "MMM yyyy"),
          total: Number(agg._sum.amount ?? 0),
          count: agg._count,
        }));
    })
  );

  // Category breakdown (all time)
  const categoryData = await db.expense.groupBy({
    by: ["categoryId"],
    where: { organizationId: orgId },
    _sum: { amount: true },
    _count: true,
  });

  const catIds = categoryData.map((c) => c.categoryId);
  const cats = catIds.length ? await db.category.findMany({ where: { id: { in: catIds } } }) : [];
  const catMap = Object.fromEntries(cats.map((c) => [c.id, c]));

  const enrichedCategories = categoryData
    .map((c) => ({
      name: catMap[c.categoryId]?.name ?? "Unknown",
      color: catMap[c.categoryId]?.color ?? "#6366f1",
      total: Number(c._sum.amount ?? 0),
      count: c._count,
    }))
    .sort((a, b) => b.total - a.total);

  // Top expenses
  const topExpenses = await db.expense.findMany({
    where: { organizationId: orgId },
    include: { category: true },
    orderBy: { amount: "desc" },
    take: 10,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Analyze your spending patterns over time</p>
      </div>
      <ReportsClient
        monthlyData={monthlyData}
        categoryData={enrichedCategories}
        topExpenses={topExpenses.map((e) => ({
          ...e,
          amount: Number(e.amount),
          categoryName: e.category.name,
          categoryColor: e.category.color,
        }))}
      />
    </div>
  );
}
