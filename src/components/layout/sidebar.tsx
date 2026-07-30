"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Receipt, PiggyBank, Tag,
  BarChart3, Settings, LogOut, ChevronsLeft, ChevronsRight,
} from "lucide-react";
import type { User } from "next-auth";
import { signOut } from "next-auth/react";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const NAV = [
  { href: "/dashboard",  label: "Dashboard",  icon: LayoutDashboard },
  { href: "/expenses",   label: "Expenses",   icon: Receipt         },
  { href: "/budgets",    label: "Budgets",    icon: PiggyBank       },
  { href: "/categories", label: "Categories", icon: Tag             },
  { href: "/reports",    label: "Reports",    icon: BarChart3       },
];

export function Sidebar({ user }: { user: User }) {
  const pathname  = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const width = collapsed ? 68 : 240;

  return (
    <aside
      className="hidden lg:flex flex-col border-r border-slate-100 bg-white shrink-0 transition-all duration-200 ease-in-out"
      style={{ width }}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-100 px-4 gap-3 overflow-hidden">
        <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
          <BarChart3 className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <span className="font-bold text-slate-900 text-[15px] whitespace-nowrap overflow-hidden">
            ExpenseTrack
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-all duration-150 group relative",
                active
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              {/* Active indicator bar */}
              {active && !collapsed && (
                <span className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r-full bg-indigo-300" />
              )}
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  active ? "text-indigo-200" : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Bottom */}
      <div className="p-3 space-y-0.5">
        <Link
          href="/settings"
          title={collapsed ? "Settings" : undefined}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <Settings className="h-4 w-4 shrink-0 text-slate-400" />
          {!collapsed && "Settings"}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          title={collapsed ? "Sign out" : undefined}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && "Sign out"}
        </button>
      </div>

      <Separator />

      {/* User + collapse toggle */}
      <div className="p-3 flex items-center gap-3 overflow-hidden">
        <Avatar className="h-8 w-8 shrink-0 ring-2 ring-slate-100">
          <AvatarImage src={user.image ?? undefined} />
          <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700 font-semibold">
            {getInitials(user.name ?? user.email ?? "U")}
          </AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-slate-900 truncate">{user.name}</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto h-6 w-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed
            ? <ChevronsRight className="h-3.5 w-3.5" />
            : <ChevronsLeft  className="h-3.5 w-3.5" />
          }
        </button>
      </div>
    </aside>
  );
}
