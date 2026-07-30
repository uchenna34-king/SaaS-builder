import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const member = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
  });
  if (!member) return new Response("No organization", { status: 404 });

  const url = new URL(req.url);
  const search = url.searchParams.get("search") ?? undefined;
  const categoryId = url.searchParams.get("categoryId") ?? undefined;
  const status = url.searchParams.get("status") as "PENDING" | "APPROVED" | "REJECTED" | undefined;

  const expenses = await db.expense.findMany({
    where: {
      organizationId: member.organizationId,
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(categoryId && { categoryId }),
      ...(status && { status }),
    },
    include: {
      category: { select: { name: true } },
      createdBy: { select: { name: true, email: true } },
    },
    orderBy: { date: "desc" },
  });

  const escape = (s: string) => `"${s.replace(/"/g, '""')}"`;

  const rows = [
    ["Title", "Amount (USD)", "Date", "Category", "Status", "Description", "Submitted By"].join(","),
    ...expenses.map((e) =>
      [
        escape(e.title),
        Number(e.amount).toFixed(2),
        format(new Date(e.date), "yyyy-MM-dd"),
        escape(e.category.name),
        e.status,
        escape(e.description ?? ""),
        escape(e.createdBy.name ?? e.createdBy.email ?? ""),
      ].join(",")
    ),
  ].join("\n");

  return new Response(rows, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="expenses-${format(new Date(), "yyyy-MM-dd")}.csv"`,
    },
  });
}
