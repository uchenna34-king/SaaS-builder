import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const member = await db.organizationMember.findFirst({
    where: { userId: session.user.id, role: { in: ["OWNER", "ADMIN"] } },
    orderBy: { createdAt: "asc" },
  });
  if (!member) return NextResponse.json({ error: "Forbidden — only owners and admins can invite members." }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid data" }, { status: 400 });
  }

  const invitedUser = await db.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true, name: true, email: true },
  });

  if (!invitedUser) {
    return NextResponse.json(
      { error: "No account found with that email. Ask them to create an account at /register first." },
      { status: 404 }
    );
  }

  const existing = await db.organizationMember.findFirst({
    where: { organizationId: member.organizationId, userId: invitedUser.id },
  });
  if (existing) {
    return NextResponse.json({ error: "That user is already a member of this workspace." }, { status: 409 });
  }

  await db.organizationMember.create({
    data: {
      organizationId: member.organizationId,
      userId: invitedUser.id,
      role: parsed.data.role,
    },
  });

  return NextResponse.json({
    success: true,
    message: `${invitedUser.name ?? invitedUser.email} has been added to the workspace.`,
  });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userId } = await req.json().catch(() => ({}));
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const callerMember = await db.organizationMember.findFirst({
    where: { userId: session.user.id, role: { in: ["OWNER", "ADMIN"] } },
    orderBy: { createdAt: "asc" },
  });
  if (!callerMember) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const targetMember = await db.organizationMember.findFirst({
    where: { organizationId: callerMember.organizationId, userId },
  });
  if (!targetMember) return NextResponse.json({ error: "Member not found" }, { status: 404 });

  if (targetMember.role === "OWNER") {
    return NextResponse.json({ error: "Cannot remove the workspace owner." }, { status: 403 });
  }

  await db.organizationMember.delete({ where: { id: targetMember.id } });
  return NextResponse.json({ success: true });
}
