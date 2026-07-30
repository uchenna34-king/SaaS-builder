import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { BudgetsClient } from "@/components/budgets/budgets-client";

type BudgetWithCategory = Prisma.BudgetGetPayload<{
  include: { category: true };
}>;

export const metadata: Metadata = { title: "Budgets" };

export default async function BudgetsPage() {
  const session = await auth();
  const member = await db.organizationMember.findFirst({
    where: { userId: session!.user!.id! },
    orderBy: { createdAt: "asc" },
  });

  if (!member) return null;
  const orgId = member.organizationId;
  const now = new Date();

  const [budgets, categories] = await Promise.all([
    db.budget.findMany({
      where: { organizationId: orgId },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    db.category.findMany({
      where: { OR: [{ organizationId: orgId }, { isSystem: true }] },
      orderBy: { name: "asc" },
    }),
  ]);

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
      const amount = Number(b.amount);
      return {
        ...b,
        amount,
        spent,
        percentage: amount > 0 ? Math.min(Math.round((spent / amount) * 100), 100) : 0,
      };
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Budgets</h1>
        <p className="text-muted-foreground">Set spending limits and track utilization</p>
      </div>
      <BudgetsClient budgets={budgetsWithSpent} categories={categories} />
    </div>
  );
}
