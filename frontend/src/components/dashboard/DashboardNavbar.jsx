"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Bell, ChevronDown, Menu, Moon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function DashboardNavbar({ onMenuToggle }) {
  const { user } = useAuth();

  const userInitials = useMemo(() => {
    const source =
      user?.name || user?.fullName || user?.email || user?.username || "Dashboard User";

    return source
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [user]);

  return (
    <header className="sticky top-0 z-50 border-b border-dashed border-border bg-black/90 backdrop-blur-md">
      <div className="flex h-14 sm:h-16">
        <div className="flex min-w-0 flex-1 items-center border-r border-dashed border-border px-4 md:w-64 md:flex-none sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-primary text-xs font-semibold text-black">
              S
            </div>
            <span className="text-sm font-medium tracking-tight text-heading">SPECTRIX</span>
          </Link>
        </div>

        <div className="hidden flex-1 items-center border-r border-dashed border-border px-4 md:flex">
          <div className="flex items-center gap-2 text-xs text-body">
            <span className="text-[0.625rem] uppercase tracking-[0.18em] text-white/45">Dashboard</span>
            <span className="text-white/25">/</span>
            <span className="text-white/80">Overview</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2 px-3 sm:px-6">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded border border-border px-3 py-1.5 text-[0.6875rem] text-body transition-colors hover:bg-white/5"
          >
            <span className="hidden lg:inline">New Alert</span>
            <Bell size={15} />
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded border border-border px-3 py-1.5 text-[0.6875rem] text-body transition-colors hover:bg-white/5"
          >
            <Moon size={15} />
          </button>

          <button
            type="button"
            onClick={onMenuToggle}
            className="inline-flex items-center rounded border border-border px-3 py-1.5 text-body transition-colors hover:bg-white/5 md:hidden"
          >
            <Menu size={16} />
          </button>

          <div className="mx-1 hidden h-8 w-px bg-border md:block" />

          <button
            type="button"
            className="hidden items-center gap-2 rounded border border-border bg-white/5 px-2 py-1.5 transition-colors hover:bg-white/10 lg:flex"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-slate-600 to-slate-900 text-[0.625rem] text-heading">
              {userInitials || "DU"}
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[0.6875rem] text-heading">{user?.name || "Workspace User"}</span>
              <span className="text-[0.625rem] text-body">Workspace</span>
            </div>
            <ChevronDown size={14} className="text-body" />
          </button>
        </div>
      </div>
    </header>
  );
}
