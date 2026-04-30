import React from "react";
import { ArrowUpRight, ExternalLink, Mail, GitCommit } from "lucide-react";
import Link from "next/link";

const socialLinks = [
    {
        name: "GitHub",
        href: "https://github.com/aakash-gupta02/Spectrix",
        icon: GitCommit,
    },
    {
        name: "Portfolio",
        href: "https://aakashgupta.app",
        icon: ExternalLink,
    },
    {
        name: "Email",
        href: "mailto:aakashgupta052004@gmail.com",
        icon: Mail,
    },
];

const navLinks = [
    { name: "Product", href: "#" },
    { name: "Features", href: "#" },
    { name: "Docs", href: "#" },
    { name: "Contact", href: "#" },
];

const pageLinks = [
    { name: "Status", href: "#" },
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
    { name: "Security", href: "#" },
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="relative mt-32 border-t border-border">
            <div className="mx-auto max-w-7xl px-6">
                {/* Top CTA */}
                <div className="border border-border bg-surface-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 py-10 md:px-10 md:py-12">
                        <div>
                            <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-heading">
                                Ready to monitor your APIs?
                            </h3>
                            <p className="text-body mt-2 max-w-md">
                                Get real-time insights and proactive alerts with Spectrix.
                            </p>
                        </div>

                        <div className="flex items-start justify-start md:justify-end">
                            <a
                                href="mailto:aakashgupta052004@gmail.com"
                                className="group inline-flex items-center gap-2 border border-border bg-page px-6 py-3 text-sm font-medium text-heading transition-all hover:border-primary hover:text-primary"
                            >
                                Start a conversation
                                <ArrowUpRight
                                    size={18}
                                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Main Footer */}
                <div className="border-x border-b border-border bg-page">
                    {/* GRID SECTION */}
                    <div className="px-6 py-12 md:px-10 md:py-16">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                            {/* BRAND */}
                            <div className="md:col-span-1">
                                <Link href="/" className="flex items-center gap-2 mb-3">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-primary text-xs font-bold text-black">
                                        S
                                    </div>
                                    <span className="font-medium tracking-tight text-white">Spectrix</span>
                                </Link>
                                <p className="text-sm text-body leading-relaxed">
                                    Synthetic API monitoring tool focused on performance, uptime visibility,
                                    and real-time system insights.
                                </p>
                            </div>

                            {/* NAVIGATION */}
                            <div>
                                <p className="text-xs font-mono uppercase tracking-wider text-muted mb-4">
                                    Navigation
                                </p>
                                <div className="flex flex-col gap-2">
                                    {navLinks.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.href}
                                            className="text-sm text-body transition-colors hover:text-heading"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* CONNECT */}
                            <div>
                                <p className="text-xs font-mono uppercase tracking-wider text-muted mb-4">
                                    Connect
                                </p>
                                <div className="flex flex-col gap-2">
                                    {socialLinks.map((link, i) => {
                                        const Icon = link.icon;
                                        return (
                                            <Link
                                                key={i}
                                                href={link.href}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group inline-flex items-center gap-2 text-sm text-body transition-colors hover:text-heading"
                                            >
                                                <Icon size={14} className="text-muted group-hover:text-primary" />
                                                <span>{link.name}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* STATUS */}
                            <div>
                                <p className="text-xs font-mono uppercase tracking-wider text-muted mb-4">
                                    Status
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 bg-success" />
                                        <span className="text-sm text-body">All systems operational</span>
                                    </div>
                                    <p className="text-sm text-muted">
                                        Open for frontend & backend roles
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM BAR */}
                    <div className="border-t border-border px-6 py-5 md:px-10">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <p className="text-xs text-muted">
                                © {year} Spectrix - Built by <Link href="https://aakashgupta.app" className="font-medium text-primary" target="_blank">
                                    Aakash Gupta
                                </Link>
                            </p>
                            <div className="flex items-center gap-3">
                                {pageLinks.map((link, i) => (
                                    <React.Fragment key={i}>
                                        <Link
                                            href={link.href}
                                            className="text-xs text-muted hover:text-heading transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                        {i < pageLinks.length - 1 && <span className="h-4 w-px bg-border" />}
                                    </React.Fragment>
                                ))}
                                <span className="h-4 w-px bg-border" />
                                <Link
                                    href="/llms.txt"
                                    className="text-xs text-muted hover:text-heading transition-colors"
                                >
                                    LLMs Policy
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* BIG BRAND TEXT - Sharp, integrated */}
                    <div className="relative overflow-hidden border-t border-border">
                        <div className="px-6 py-8 md:px-10 md:py-12">
                            <h2 className="select-none text-center text-[20vw] leading-[0.78] font-medium tracking-tighter text-muted/5 md:text-[12rem] whitespace-nowrap">
                                SPECTRIX
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}