import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, formatDate } from "@/lib/utils";
import { Crown, User, Shield } from "lucide-react";

export const metadata: Metadata = { title: "Settings" };

const ROLE_ICONS = { OWNER: Crown, ADMIN: Shield, MEMBER: User };
const ROLE_COLORS = { OWNER: "bg-amber-100 text-amber-700", ADMIN: "bg-blue-100 text-blue-700", MEMBER: "bg-gray-100 text-gray-700" };

export default async function SettingsPage() {
  const session = await auth();
  const member = await db.organizationMember.findFirst({
    where: { userId: session!.user!.id! },
    include: {
      organization: {
        include: {
          members: {
            include: { user: { select: { id: true, name: true, email: true, image: true, createdAt: true } } },
            orderBy: { createdAt: "asc" },
          },
          _count: { select: { expenses: true, budgets: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  if (!member) return null;
  const { organization } = member;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your workspace and account</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>Organization details and plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{organization.name}</p>
              <p className="text-sm text-muted-foreground">/{organization.slug}</p>
            </div>
            <Badge variant="secondary" className="capitalize">{organization.plan.toLowerCase()} plan</Badge>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">{organization._count.expenses}</p>
              <p className="text-xs text-muted-foreground">Expenses</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">{organization._count.budgets}</p>
              <p className="text-xs text-muted-foreground">Budgets</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">{organization.members.length}</p>
              <p className="text-xs text-muted-foreground">Members</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>People with access to this workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {organization.members.map((m) => {
              const RoleIcon = ROLE_ICONS[m.role as keyof typeof ROLE_ICONS];
              return (
                <div key={m.userId} className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={m.user.image ?? undefined} />
                    <AvatarFallback className="text-xs">{getInitials(m.user.name ?? m.user.email)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{m.user.name}</p>
                    <p className="text-xs text-muted-foreground">{m.user.email}</p>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[m.role as keyof typeof ROLE_COLORS]}`}>
                    <RoleIcon className="h-3 w-3" />
                    {m.role.toLowerCase()}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={session?.user?.image ?? undefined} />
              <AvatarFallback>{getInitials(session?.user?.name ?? session?.user?.email ?? "U")}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{session?.user?.name}</p>
              <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Member since {formatDate(new Date())}
          </p>
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50/30">
        <CardHeader>
          <CardTitle className="text-base">Upgrade to Pro</CardTitle>
          <CardDescription>Unlock unlimited members, advanced reports, and priority support.</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge>Coming soon</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
