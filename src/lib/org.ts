import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function getCurrentOrg() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const member = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
    orderBy: { createdAt: "asc" },
  });

  if (!member) redirect("/onboarding");
  return { org: member.organization, user: session.user, role: member.role };
}

export async function requireOrgAccess(organizationId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const member = await db.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId: session.user.id,
      },
    },
  });

  if (!member) {
    throw new Error("Unauthorized: not a member of this organization");
  }

  return { userId: session.user.id, role: member.role };
}
