"use client";

import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "#" },
    { name: "Docs", href: "#" },
    { name: "Pricing", href: "#" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dashed border-white/10 bg-black">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between sm:h-20">
        
        {/* LEFT: Logo Section */}
        <div className="flex h-full items-center border-r border-dashed border-white/10 px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-primary text-xs font-bold text-black">
              S
            </div>
            <span className="font-medium tracking-tight text-white">Spectrix</span>
          </Link>
        </div>

        {/* CENTER: Navigation (Desktop Only) */}
        <nav className="hidden h-full items-center md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex h-full items-center border-r border-dashed border-white/10 px-8 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* RIGHT: Actions */}
        <div className="flex h-full items-center">
          <Link
            href="#"
            className="hidden h-full items-center border-l border-dashed border-white/10 px-8 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:bg-white/5 hover:text-white md:flex"
          >
            Login
          </Link>
          
          <Link
            href="#"
            className="flex h-full items-center gap-2 border-l border-dashed border-white/10 bg-primary/5 px-6 text-[10px] font-bold uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-black sm:px-10"
          >
            DASHBOARD
            <ArrowRight size={14} />
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-full items-center border-l border-dashed border-white/10 px-6 text-white md:hidden"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <div 
        className={`fixed inset-0 top-16 z-60 w-full transform border-t border-dashed border-white/10 bg-black transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="border-b border-dashed border-white/10 p-8 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400 hover:bg-white/5"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="#"
            onClick={() => setIsOpen(false)}
            className="border-b border-dashed border-white/10 p-8 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400 hover:bg-white/5"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}