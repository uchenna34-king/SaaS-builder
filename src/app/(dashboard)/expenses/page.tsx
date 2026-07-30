import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { ExpensesTable } from "@/components/expenses/expenses-table";
import { Plus } from "lucide-react";

export const metadata: Metadata = { title: "Expenses" };

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; categoryId?: string; status?: string };
}) {
  const session = await auth();
  const member = await db.organizationMember.findFirst({
    where: { userId: session!.user!.id! },
    orderBy: { createdAt: "asc" },
  });

  if (!member) return null;

  const page = Number(searchParams.page ?? 1);
  const limit = 20;
  const skip = (page - 1) * limit;

  const where = {
    organizationId: member.organizationId,
    ...(searchParams.search && {
      OR: [
        { title: { contains: searchParams.search, mode: "insensitive" as const } },
        { description: { contains: searchParams.search, mode: "insensitive" as const } },
      ],
    }),
    ...(searchParams.categoryId && { categoryId: searchParams.categoryId }),
    ...(searchParams.status && {
      status: searchParams.status as "PENDING" | "APPROVED" | "REJECTED",
    }),
  };

  const [expenses, total, categories] = await Promise.all([
    db.expense.findMany({
      where,
      include: {
        category: true,
        createdBy: { select: { id: true, name: true, image: true } },
        tags: { include: { tag: true } },
      },
      orderBy: { date: "desc" },
      skip,
      take: limit,
    }),
    db.expense.count({ where }),
    db.category.findMany({
      where: { OR: [{ organizationId: member.organizationId }, { isSystem: true }] },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">{total} total transactions</p>
        </div>
        <Button asChild>
          <Link href="/expenses/new">
            <Plus className="h-4 w-4 mr-2" /> Add Expense
          </Link>
        </Button>
      </div>

      <ExpensesTable
        expenses={expenses}
        categories={categories}
        total={total}
        page={page}
        limit={limit}
        searchParams={searchParams}
      />
    </div>
  );
}
