"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const formatSlugLabel = (value) =>
  value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export function DocsNavbar({ onMenuToggle }) {
  const pathname = usePathname();

  const currentSectionLabel = useMemo(() => {
    if (!pathname || pathname === "/docs") {
      return "Introduction";
    }

    const segments = pathname
      .replace("/docs/", "")
      .split("/")
      .filter(Boolean);
    if (!segments.length) {
      return "Introduction";
    }

    if (segments.length === 1) {
      return formatSlugLabel(segments[0]);
    }

    const primaryLabel = formatSlugLabel(segments[0]);
    const secondaryLabel = formatSlugLabel(segments[1]);

    return `${primaryLabel} / ${secondaryLabel}`;
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-dashed border-border bg-black/90 backdrop-blur-md">
      <div className="flex h-14 sm:h-16">
        {/* Logo */}
        <div className="flex min-w-0 flex-1 items-center border-r border-dashed border-border px-4 md:w-64 md:flex-none sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-primary text-xs font-semibold text-black">
              S
            </div>
            <span className="text-sm font-medium tracking-tight text-heading">
              SPECTRIX
            </span>
          </Link>
        </div>

        {/* Breadcrumb */}
        <div className="hidden flex-1 items-center justify-between border-r border-dashed border-border px-4 md:flex">
          <div className="flex items-center gap-2 text-xs text-body">
            <span className="text-[0.625rem] uppercase tracking-[0.18em] text-white/45">
              Docs
            </span>
            <span className="text-white/25">/</span>
            <span className="text-white/80">{currentSectionLabel}</span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex shrink-0 items-center justify-end gap-2 px-3 sm:px-6">
          <nav className="hidden md:flex items-center gap-4 text-[0.8125rem] font-medium mr-4">
            <Link href="/docs" className="text-heading hover:text-primary transition-colors">Docs</Link>
            <Link href="/dashboard" className="text-body hover:text-heading transition-colors">Dashboard</Link>
          </nav>

          <button
            type="button"
            onClick={onMenuToggle}
            className="inline-flex items-center rounded border border-border px-3 py-1.5 text-body transition-colors hover:bg-white/5 md:hidden"
          >
            <Menu size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
