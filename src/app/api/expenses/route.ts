import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createExpenseSchema, expenseFilterSchema } from "@/lib/validations/expense";

async function getUserOrg(userId: string) {
  const member = await db.organizationMember.findFirst({
    where: { userId },
    select: { organizationId: true },
    orderBy: { createdAt: "asc" },
  });
  return member?.organizationId;
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const filters = expenseFilterSchema.safeParse(Object.fromEntries(searchParams));
  if (!filters.success) return NextResponse.json({ error: "Invalid filters" }, { status: 400 });

  const orgId = await getUserOrg(session.user.id);
  if (!orgId) return NextResponse.json({ error: "No organization" }, { status: 404 });

  const { startDate, endDate, categoryId, status, search, page, limit } = filters.data;
  const skip = (page - 1) * limit;

  const where = {
    organizationId: orgId,
    ...(startDate && { date: { gte: new Date(startDate) } }),
    ...(endDate && { date: { lte: new Date(endDate) } }),
    ...(categoryId && { categoryId }),
    ...(status && { status }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [expenses, total] = await Promise.all([
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
  ]);

  return NextResponse.json({
    data: expenses,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createExpenseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const orgId = await getUserOrg(session.user.id);
  if (!orgId) return NextResponse.json({ error: "No organization" }, { status: 404 });

  const { title, amount, date, categoryId, description, tagIds, status } = parsed.data;

  const expense = await db.expense.create({
    data: {
      title,
      amount,
      date: new Date(date),
      categoryId,
      description,
      status,
      organizationId: orgId,
      createdById: session.user.id,
      ...(tagIds?.length && {
        tags: {
          create: tagIds.map((tagId) => ({ tagId })),
        },
      }),
    },
    include: {
      category: true,
      createdBy: { select: { id: true, name: true, image: true } },
      tags: { include: { tag: true } },
    },
  });

  return NextResponse.json({ data: expense }, { status: 201 });
}
