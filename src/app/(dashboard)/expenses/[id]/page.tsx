import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ExpenseForm } from "@/components/expenses/expense-form";

export const metadata: Metadata = { title: "Edit Expense" };

export default async function EditExpensePage({ params }: { params: { id: string } }) {
  const session = await auth();

  const expense = await db.expense.findFirst({
    where: {
      id: params.id,
      organization: { members: { some: { userId: session!.user!.id! } } },
    },
    include: { category: true },
  });

  if (!expense) notFound();

  const member = await db.organizationMember.findFirst({
    where: { userId: session!.user!.id! },
    orderBy: { createdAt: "asc" },
  });

  const categories = await db.category.findMany({
    where: { OR: [{ organizationId: member?.organizationId }, { isSystem: true }] },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Expense</h1>
        <p className="text-muted-foreground">Update expense details</p>
      </div>
      <ExpenseForm
        categories={categories}
        expenseId={expense.id}
        defaultValues={{
          title: expense.title,
          amount: String(expense.amount),
          date: expense.date.toISOString().split("T")[0],
          categoryId: expense.categoryId,
          description: expense.description ?? undefined,
          status: expense.status,
        }}
      />
    </div>
  );
}
