import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateExpenseSchema } from "@/lib/validations/expense";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const expense = await db.expense.findFirst({
    where: {
      id: params.id,
      organization: { members: { some: { userId: session.user.id } } },
    },
    include: {
      category: true,
      createdBy: { select: { id: true, name: true, image: true } },
      tags: { include: { tag: true } },
    },
  });

  if (!expense) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: expense });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = updateExpenseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await db.expense.findFirst({
    where: {
      id: params.id,
      organization: { members: { some: { userId: session.user.id } } },
    },
  });

  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { tagIds, ...rest } = parsed.data;

  const expense = await db.expense.update({
    where: { id: params.id },
    data: {
      ...rest,
      ...(rest.amount !== undefined && { amount: rest.amount }),
      ...(rest.date !== undefined && { date: new Date(rest.date) }),
      ...(tagIds !== undefined && {
        tags: {
          deleteMany: {},
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

  return NextResponse.json({ data: expense });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await db.expense.findFirst({
    where: {
      id: params.id,
      organization: { members: { some: { userId: session.user.id } } },
    },
  });

  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.expense.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Deleted" });
}
