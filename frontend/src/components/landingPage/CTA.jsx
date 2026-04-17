import React from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  const points = [
    "No credit card required",
    "Setup in under 10 minutes",
    "Slack, Discord, and webhook alerts",
    "Built for developers and small teams",
  ];

  return (
    <section className="border-t border-border bg-page py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="border border-border bg-surface-1">
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Left Column */}
            <div className="col-span-12 border-b border-border p-8 md:col-span-7 md:border-b-0 md:border-r md:p-12">
              <div className="mb-6 inline-flex items-center gap-2 border border-border bg-surface-2 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-primary">
                03. Get Started
              </div>

              <h2 className="max-w-2xl text-4xl leading-[1.05] font-light tracking-tighter text-heading md:text-5xl lg:text-6xl">
                Start monitoring your API in minutes.
              </h2>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-body md:text-lg">
                Configure checks, set alert rules, and get fast visibility into endpoint health
                without heavyweight setup.
              </p>

              <div className="mt-10 grid max-w-xl grid-cols-1 overflow-hidden border border-dashed border-border sm:grid-cols-2">
                <Link
                  href="/start"
                  className="flex items-center justify-center gap-2 border-b border-border bg-primary px-6 py-4 text-xs font-medium tracking-wide text-black transition-colors hover:bg-primary-strong sm:border-b-0 sm:border-r"
                >
                  Start Free Trial
                  <ArrowUpRight size={16} strokeWidth={1.8} />
                </Link>
                <Link
                  href="#how-it-works"
                  className="flex items-center justify-center gap-2 px-6 py-4 text-xs font-medium tracking-wide text-heading transition-colors hover:bg-surface-2"
                >
                  View Setup Steps
                  <ArrowUpRight size={16} strokeWidth={1.8} />
                </Link>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-12 p-8 md:col-span-5 md:p-12">
              <p className="mb-6 text-xs uppercase tracking-[0.2em] text-muted">What you get</p>

              <div className="space-y-4">
                {points.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 border-b border-border pb-4 last:border-0"
                  >
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" strokeWidth={1.8} />
                    <p className="text-sm leading-relaxed text-body">{point}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 border border-border bg-surface-2/50 p-4">
                <p className="text-[11px] leading-relaxed text-muted">
                  Spectrix is a lightweight API monitoring tool focused on fast setup and clear
                  alerts for production services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}