import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";

export default function Navbar() {

    const leftLinks = [
        { name: "Features", href: "#" },
        { name: "Docs", href: "#" },
        { name: "Pricing", href: "#" },
    ]

    const rightLinks = [
        { name: "Dashboard", href: "#" },
        { name: "Get Started", href: "#", isPrimary: true },
    ]

    
  return (
    <header className="sticky top-0 z-50 w-full border-dashed bg-black backdrop-blur-md">
      <div className="grid h-16 grid-cols-12 sm:h-20">
        <div className="col-span-4 hidden items-center md:flex">
            {leftLinks.map((link) => (
                <Link
                    key={link.name}
                    href={link.href}
                    className="flex h-full items-center justify-center border-r border-dashed border-white/10 px-8 text-xs font-normal tracking-wide text-body transition-colors hover:text-heading"
                >
                    {link.name}
                </Link>
            ))}

        </div>

        <div className="col-span-2 flex items-center border-r border-dashed border-white/10 pl-6 md:hidden">
          <Menu size={24} className="text-white" strokeWidth={1.5} />
        </div>

        <div className="relative col-span-8 flex items-center justify-center md:col-span-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-primary text-xs font-semibold text-black">
              S
            </div>
            <span className="font-medium tracking-tight text-heading">Spectrix</span>
          </div>
        </div>

        <div className="col-span-2 flex items-center justify-end md:col-span-4">
          <Link
            href="#"
            className="hidden h-full items-center justify-center border-l border-r border-dashed border-white/10 px-8 text-xs font-normal tracking-wide text-body transition-colors hover:text-heading md:flex"
          >
            DASHBOARD
          </Link>
          <Link
            href="#"
            className="flex h-full w-full items-center justify-center gap-2 px-8 text-xs font-normal tracking-wide text-heading transition-colors hover:text-primary md:w-auto"
          >
            GET STARTED
            <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </header>
  );
}
