"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlignLeft, Book, ChevronRight, Code } from "lucide-react";

const navigation = [
  {
    title: "Getting Started",
    icon: Book,
    links: [
      { href: "/docs", label: "Introduction" },
    ],
  },
  {
    title: "Core Concepts",
    icon: AlignLeft,
    links: [
      { href: "/docs/services", label: "Services" },
      { href: "/docs/endpoints", label: "Endpoints" },
      { href: "/docs/alert-channels", label: "Alert Channels" },
    ],
  },
  {
    title: "Platform",
    icon: Code,
    links: [
      { href: "/docs/dashboard", label: "Dashboard Monitoring" },
    ],
  },
];

export function DocsSidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      <aside
        className={`fixed inset-y-14 left-0 z-40 flex w-64 flex-col border-r border-dashed border-border bg-page transition-transform duration-200 sm:inset-y-16 md:static md:inset-auto md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="no-scrollbar flex-1 overflow-y-auto py-6">
          <div className="px-6 mb-4">
            <h2 className="text-sm font-semibold text-heading tracking-tight">Documentation</h2>
          </div>
          {navigation.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div key={idx} className="mb-6 px-3">
                <div className="mb-2 px-3 flex items-center gap-2 text-[0.625rem] uppercase tracking-[0.2em] text-white/40">
                  <Icon size={12} />
                  <span>{section.title}</span>
                </div>
                <nav className="space-y-1">
                  {section.links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={onClose}
                        className={`flex items-center justify-between rounded px-3 py-2 text-[0.8125rem] transition-colors ${
                          isActive
                            ? "bg-white/5 text-primary"
                            : "text-body hover:bg-white/5 hover:text-heading"
                        }`}
                      >
                        <span>{link.label}</span>
                        {isActive && <ChevronRight size={14} />}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            );
          })}
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
