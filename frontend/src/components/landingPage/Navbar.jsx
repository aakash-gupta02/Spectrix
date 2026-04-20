"use client";

import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Alerts", href: "#alerts" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-page">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between sm:h-20">
        {/* LOGO */}
        <div className="flex h-full items-center border-x border-dashed border-border px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center bg-primary text-xs font-bold text-black">
              S
            </div>
            <span className="font-medium tracking-tight text-white">
              Spectrix
            </span>
          </Link>
        </div>

        {/* NAV */}
        <nav className="hidden h-full items-center md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex h-full items-center border-x border-dashed border-border px-8 text-xs font-medium uppercase tracking-wide text-muted transition-colors hover:text-white hover:bg-white/5"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* RIGHT */}
        <div className="flex h-full items-center">
          <Link
            href="/dashboard"
            className="group flex h-full items-center gap-2 border-x border-dashed border-border px-6 text-xs font-semibold uppercase tracking-wide text-primary transition-all hover:bg-primary hover:text-black sm:px-10"
          >
            Go to App
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-full items-center border-l border-border px-6 text-white md:hidden"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE */}
      <div
        className={`fixed inset-0 top-16 z-50 w-full transform border-t border-border bg-page transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="border-b border-border p-8 text-sm font-medium uppercase tracking-wide text-muted hover:bg-white/5 hover:text-white"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between border-b border-border p-8 text-sm font-medium uppercase tracking-wide text-primary hover:bg-white/5"
          >
            Go to App
            <ArrowRight size={16} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
