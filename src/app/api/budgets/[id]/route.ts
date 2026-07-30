import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const budget = await db.budget.findFirst({
    where: {
      id: params.id,
      organization: { members: { some: { userId: session.user.id } } },
    },
  });

  if (!budget) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.budget.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Deleted" });
}
