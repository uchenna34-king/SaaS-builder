import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#6366f1"),
  icon: z.string().default("tag"),
});

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

  const categories = await db.category.findMany({
    where: {
      OR: [{ organizationId: orgId }, { isSystem: true }],
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ data: categories });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createCategorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const orgId = await getUserOrg(session.user.id);
  if (!orgId) return NextResponse.json({ error: "No organization" }, { status: 404 });

  const category = await db.category.create({
    data: { ...parsed.data, organizationId: orgId },
  });

  return NextResponse.json({ data: category }, { status: 201 });
}
