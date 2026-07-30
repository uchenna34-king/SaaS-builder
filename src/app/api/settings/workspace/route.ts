import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const member = await db.organizationMember.findFirst({
    where: { userId: session.user.id, role: { in: ["OWNER", "ADMIN"] } },
    orderBy: { createdAt: "asc" },
  });
  if (!member) return NextResponse.json({ error: "Forbidden — only owners and admins can update workspace settings." }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const slug = parsed.data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const org = await db.organization.update({
    where: { id: member.organizationId },
    data: { name: parsed.data.name, slug },
    select: { id: true, name: true, slug: true },
  });

  return NextResponse.json({ org });
}
