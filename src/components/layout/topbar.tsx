"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "next-auth";
import { signOut } from "next-auth/react";
import {
  Bell, Settings, LogOut, BarChart3,
  LayoutDashboard, Receipt, PiggyBank, Tag, X, Menu,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV = [
  { href: "/dashboard",  label: "Dashboard",  icon: LayoutDashboard },
  { href: "/expenses",   label: "Expenses",   icon: Receipt         },
  { href: "/budgets",    label: "Budgets",    icon: PiggyBank       },
  { href: "/categories", label: "Categories", icon: Tag             },
  { href: "/reports",    label: "Reports",    icon: BarChart3       },
];

const PAGE_TITLES: Record<string, string> = {
  "/dashboard":  "Dashboard",
  "/expenses":   "Expenses",
  "/budgets":    "Budgets",
  "/categories": "Categories",
  "/reports":    "Reports",
  "/settings":   "Settings",
};

function getTitle(pathname: string): string {
  for (const [key, val] of Object.entries(PAGE_TITLES)) {
    if (pathname === key || pathname.startsWith(key + "/")) return val;
  }
  return "ExpenseTrack";
}

export function TopBar({ user }: { user: User }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="h-16 border-b border-slate-100 bg-white flex items-center justify-between px-6 shrink-0">
        {/* Left: mobile menu toggle + page title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden h-9 w-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-semibold text-slate-900 text-[15px]">{getTitle(pathname)}</h1>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1.5">
          <button className="h-9 w-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors">
            <Bell className="h-4.5 w-4.5" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 rounded-lg pl-2 pr-3 py-1.5 hover:bg-slate-50 transition-colors">
                <Avatar className="h-7 w-7 ring-2 ring-slate-100">
                  <AvatarImage src={user.image ?? undefined} />
                  <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700 font-semibold">
                    {getInitials(user.name ?? user.email ?? "U")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[13px] font-medium text-slate-700 hidden sm:block">
                  {user.name?.split(" ")[0]}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="font-normal">
                <p className="font-semibold text-sm text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="gap-2">
                  <Settings className="h-3.5 w-3.5 text-slate-400" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 gap-2"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col">
            <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100">
              <div className="flex items-center gap-2.5 font-bold text-slate-900">
                <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-white" strokeWidth={2.5} />
                </div>
                ExpenseTrack
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-0.5">
              {NAV.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-indigo-600 text-white"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", active ? "text-indigo-200" : "text-slate-400")} />
                    {label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.image ?? undefined} />
                  <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700 font-semibold">
                    {getInitials(user.name ?? user.email ?? "U")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
