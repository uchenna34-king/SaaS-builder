import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const category = await db.category.findFirst({
    where: {
      id: params.id,
      isSystem: false,
      organization: { members: { some: { userId: session.user.id } } },
    },
  });

  if (!category) return NextResponse.json({ error: "Not found or system category" }, { status: 404 });

  await db.category.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Deleted" });
}
