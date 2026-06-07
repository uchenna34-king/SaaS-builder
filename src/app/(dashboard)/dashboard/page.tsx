import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { Suspense } from "react";
import { auth } from "@/lib/auth";

type BudgetWithCategory = Prisma.BudgetGetPayload<{
  include: { category: true };
}>;
import { db } from "@/lib/db";
import { DashboardStats } from "@/components/dashboard/stats-cards";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { CategoryPieChart } from "@/components/dashboard/category-pie";
import { RecentExpenses } from "@/components/dashboard/recent-expenses";
import { BudgetOverview } from "@/components/dashboard/budget-overview";
import {
  startOfMonth, endOfMonth, subMonths, format,
  startOfWeek, endOfWeek,
} from "date-fns";

export const metadata: Metadata = { title: "Dashboard" };

async function getDashboardData(orgId: string) {
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const prevMonthStart = startOfMonth(subMonths(now, 1));
  const prevMonthEnd = endOfMonth(subMonths(now, 1));

  const [totalAgg, monthAgg, prevMonthAgg, categoryBreakdown, recentExpenses, budgets] =
    await Promise.all([
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
        take: 4,
      }),
    ]);

  // Enrich categories
  const catIds = categoryBreakdown.map((c) => c.categoryId);
  const cats = catIds.length
    ? await db.category.findMany({ where: { id: { in: catIds } } })
    : [];
  const catMap = Object.fromEntries(cats.map((c) => [c.id, c]));

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
  const budgetsWithSpent = await Promise.all(
    budgets.map(async (b: BudgetWithCategory) => {
      const agg = await db.expense.aggregate({
        where: {
          organizationId: orgId,
          ...(b.categoryId ? { categoryId: b.categoryId } : {}),
          date: { gte: b.startDate, lte: b.endDate ?? now },
        },
        _sum: { amount: true },
      });
      const spent = Number(agg._sum.amount ?? 0);
      const budgetAmount = Number(b.amount);
      return {
        ...b,
        amount: budgetAmount,
        spent,
        percentage: budgetAmount > 0 ? Math.min(Math.round((spent / budgetAmount) * 100), 100) : 0,
      };
    })
  );

  return {
    totalExpenses: Number(totalAgg._sum.amount ?? 0),
    totalExpensesCount: totalAgg._count,
    monthlyExpenses: Number(monthAgg._sum.amount ?? 0),
    prevMonthExpenses: Number(prevMonthAgg._sum.amount ?? 0),
    categoryBreakdown: enrichedCategories,
    monthlyTrend,
    recentExpenses,
    budgets: budgetsWithSpent,
  };
}

export default async function DashboardPage() {
  const session = await auth();

  const member = await db.organizationMember.findFirst({
    where: { userId: session!.user!.id! },
    include: { organization: true },
    orderBy: { createdAt: "asc" },
  });

  if (!member) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No organization found. Please contact support.</p>
      </div>
    );
  }

  const data = await getDashboardData(member.organizationId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Good {getGreeting()}, {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground">
          Here&rsquo;s what&rsquo;s happening with {member.organization.name} this month.
        </p>
      </div>

      <DashboardStats
        totalExpenses={data.totalExpenses}
        totalExpensesCount={data.totalExpensesCount}
        monthlyExpenses={data.monthlyExpenses}
        prevMonthExpenses={data.prevMonthExpenses}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SpendingChart data={data.monthlyTrend} />
        </div>
        <div>
          <CategoryPieChart data={data.categoryBreakdown} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <RecentExpenses expenses={data.recentExpenses} />
        <BudgetOverview budgets={data.budgets} />
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
