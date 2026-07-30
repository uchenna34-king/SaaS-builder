import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ExpenseForm } from "@/components/expenses/expense-form";

export const metadata: Metadata = { title: "Add Expense" };

export default async function NewExpensePage() {
  const session = await auth();
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
        <h1 className="text-2xl font-bold tracking-tight">Add Expense</h1>
        <p className="text-muted-foreground">Record a new expense transaction</p>
      </div>
      <ExpenseForm categories={categories} />
    </div>
  );
}
