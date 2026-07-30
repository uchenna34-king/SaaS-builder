import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar user={session.user} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar user={session.user} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
