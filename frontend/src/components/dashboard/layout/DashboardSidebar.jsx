"use client";

import {
  Bell,
  ChartColumn,
  ChevronDown,
  CreditCard,
  Globe,
  LayoutGrid,
  LogOut,
  Settings,
  Terminal,
  TriangleAlert,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ServiceDropDown from "./ServiceDropDown";

const sideNavGroups = [
  {
    title: "Core",
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutGrid },
      { label: "API's", href: "/dashboard/apis", icon: Terminal },
      { label: "Alerts", href: "/dashboard/alerts", icon: Bell },
      { label: "Incidents", href: "/dashboard/incidents", icon: TriangleAlert },
      { label: "Analytics", href: "/dashboard/analytics", icon: ChartColumn },
    ],
  },
  {
    title: "Client Experience",
    items: [{ label: "Status Page", href: "/dashboard/status-page", icon: Globe }],
  },
  {
    title: "Workspace",
    items: [
      { label: "Team & Access", href: "/dashboard/team", icon: Users },
      { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export default function DashboardSidebar({ isOpen, onClose }) {
  const router = useRouter();
  const { clearAuth } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    clearAuth();
    onClose();
    router.replace("/login");
  };

  return (
    <>
      <aside
        className={`fixed inset-y-14 left-0 z-40 w-64 border-r border-dashed border-border bg-page transition-transform duration-200 sm:inset-y-16 md:static md:inset-auto md:flex md:translate-x-0 md:flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >

        <ServiceDropDown />

        <div className="no-scrollbar flex-1 overflow-y-auto py-4 text-xs">
          {sideNavGroups.map((group) => (
            <div key={group.title} className="mb-4 px-3 last:mb-0">
              <p className="mb-2 px-3 text-[0.625rem] uppercase tracking-[0.2em] text-white/40">
                {group.title}
              </p>
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname?.startsWith(item.href);

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={onClose}
                      className={`flex w-full items-center gap-2 rounded px-3 py-2 text-[0.75rem] transition-colors ${isActive
                          ? "bg-white/5 text-heading"
                          : "text-body hover:bg-white/5 hover:text-heading"
                        }`}
                    >
                      <Icon size={16} className={isActive ? "text-primary" : ""} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="space-y-2 border-t border-dashed border-border px-3 py-3 text-[0.625rem] text-body">
          <div className="flex items-center justify-between">
            <span>MVP Workspace</span>
            <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-emerald-400">
              Live
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded border border-border px-2 py-2 text-xs text-body transition-colors hover:bg-white/5"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 top-14 z-30 bg-black/50 sm:top-16 md:hidden"
        />
      )}
    </>
  );
}
