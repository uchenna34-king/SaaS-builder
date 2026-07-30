import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CategoriesClient } from "@/components/categories/categories-client";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const session = await auth();
  const member = await db.organizationMember.findFirst({
    where: { userId: session!.user!.id! },
    orderBy: { createdAt: "asc" },
  });

  if (!member) return null;

  const [categories, expenseCounts] = await Promise.all([
    db.category.findMany({
      where: { OR: [{ organizationId: member.organizationId }, { isSystem: true }] },
      orderBy: { name: "asc" },
    }),
    db.expense.groupBy({
      by: ["categoryId"],
      where: { organizationId: member.organizationId },
      _count: true,
    }),
  ]);

  const countMap = Object.fromEntries(expenseCounts.map((e) => [e.categoryId, e._count]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">Organize your expenses into custom categories</p>
      </div>
      <CategoriesClient
        categories={categories}
        expenseCounts={countMap}
        orgId={member.organizationId}
      />
    </div>
  );
}
