import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createBudgetSchema } from "@/lib/validations/budget";

async function getUserOrg(userId: string) {
  const member = await db.organizationMember.findFirst({
    where: { userId },
    select: { organizationId: true },
    orderBy: { createdAt: "asc" },
  });
  return member?.organizationId;
}

export async function GET(_req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orgId = await getUserOrg(session.user.id);
  if (!orgId) return NextResponse.json({ error: "No organization" }, { status: 404 });

  const budgets = await db.budget.findMany({
    where: { organizationId: orgId },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  // Calculate spent per budget
  const budgetsWithSpent = await Promise.all(
    budgets.map(async (budget) => {
      const now = new Date();
      const spent = await db.expense.aggregate({
        where: {
          organizationId: orgId,
          ...(budget.categoryId && { categoryId: budget.categoryId }),
          date: {
            gte: budget.startDate,
            lte: budget.endDate ?? now,
          },
        },
        _sum: { amount: true },
      });
      return {
        ...budget,
        spent: Number(spent._sum.amount ?? 0),
        percentage: Math.min(
          Math.round((Number(spent._sum.amount ?? 0) / Number(budget.amount)) * 100),
          100
        ),
      };
    })
  );

  return NextResponse.json({ data: budgetsWithSpent });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createBudgetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const orgId = await getUserOrg(session.user.id);
  if (!orgId) return NextResponse.json({ error: "No organization" }, { status: 404 });

  const { amount, startDate, endDate, ...rest } = parsed.data;

  const budget = await db.budget.create({
    data: {
      ...rest,
      amount,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      organizationId: orgId,
    },
    include: { category: true },
  });

  return NextResponse.json({ data: budget }, { status: 201 });
}
