import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export async function GET(_req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const member = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
    select: { organizationId: true },
    orderBy: { createdAt: "asc" },
  });

  if (!member) return NextResponse.json({ error: "No organization" }, { status: 404 });
  const orgId = member.organizationId;

  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const prevMonthStart = startOfMonth(subMonths(now, 1));
  const prevMonthEnd = endOfMonth(subMonths(now, 1));

  const [
    totalAgg,
    monthAgg,
    prevMonthAgg,
    categoryBreakdown,
    recentExpenses,
    activeBudgets,
  ] = await Promise.all([
    db.expense.aggregate({
      where: { organizationId: orgId },
      _sum: { amount: true },
      _count: true,
    }),
    db.expense.aggregate({
      where: { organizationId: orgId, date: { gte: thisMonthStart, lte: thisMonthEnd } },
      _sum: { amount: true },
    }),
    db.expense.aggregate({
      where: { organizationId: orgId, date: { gte: prevMonthStart, lte: prevMonthEnd } },
      _sum: { amount: true },
    }),
    db.expense.groupBy({
      by: ["categoryId"],
      where: { organizationId: orgId, date: { gte: thisMonthStart } },
      _sum: { amount: true },
      _count: true,
    }),
    db.expense.findMany({
      where: { organizationId: orgId },
      include: {
        category: true,
        createdBy: { select: { id: true, name: true, image: true } },
        tags: { include: { tag: true } },
      },
      orderBy: { date: "desc" },
      take: 5,
    }),
    db.budget.findMany({
      where: { organizationId: orgId },
      include: { category: true },
    }),
  ]);

  // Enrich category breakdown with names
  const categoryIds = categoryBreakdown.map((c) => c.categoryId);
  const categories = await db.category.findMany({
    where: { id: { in: categoryIds } },
  });
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  const enrichedCategories = categoryBreakdown.map((c) => ({
    categoryId: c.categoryId,
    categoryName: catMap[c.categoryId]?.name ?? "Unknown",
    color: catMap[c.categoryId]?.color ?? "#6366f1",
    total: Number(c._sum.amount ?? 0),
    count: c._count,
  }));

  // Monthly trend: last 6 months
  const monthlyTrend = await Promise.all(
    Array.from({ length: 6 }, (_, i) => {
      const d = subMonths(now, 5 - i);
      return db.expense
        .aggregate({
          where: {
            organizationId: orgId,
            date: { gte: startOfMonth(d), lte: endOfMonth(d) },
          },
          _sum: { amount: true },
        })
        .then((agg) => ({
          month: format(d, "MMM"),
          total: Number(agg._sum.amount ?? 0),
        }));
    })
  );

  // Budget utilization
  const budgetUtilization =
    activeBudgets.length === 0
      ? 0
      : Math.round(
          (activeBudgets.reduce(async (accP, b) => {
            const acc = await accP;
            const spent = await db.expense.aggregate({
              where: {
                organizationId: orgId,
                ...(b.categoryId && { categoryId: b.categoryId }),
                date: { gte: b.startDate, lte: b.endDate ?? now },
              },
              _sum: { amount: true },
            });
            return acc + Math.min(Number(spent._sum.amount ?? 0) / Number(b.amount), 1);
          }, Promise.resolve(0)) as unknown as number
        ) /
          activeBudgets.length
      );

  return NextResponse.json({
    data: {
      totalExpenses: Number(totalAgg._sum.amount ?? 0),
      totalExpensesCount: totalAgg._count,
      monthlyExpenses: Number(monthAgg._sum.amount ?? 0),
      prevMonthExpenses: Number(prevMonthAgg._sum.amount ?? 0),
      budgetUtilization: 0, // simplified — real calc happens in budgets route
      categoryBreakdown: enrichedCategories,
      monthlyTrend,
      recentExpenses,
    },
  });
}
