import React from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function CTA() {
  const points = [
    "14-day free trial, no credit card",
    "Deploy in under 10 minutes",
    "Slack + PagerDuty alerts included",
    "SOC 2-ready infrastructure",
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
                Put your API on autopilot.
              </h2>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-body md:text-lg">
                Spin up synthetic checks, anomaly alerts, and weekly SLA reports in one workflow.
                Built for teams shipping at production scale.
              </p>

              <div className="mt-10 grid max-w-xl grid-cols-1 overflow-hidden border border-dashed border-border sm:grid-cols-2">
                <button className="flex items-center justify-center gap-2 border-b border-border bg-primary px-6 py-4 text-xs font-medium tracking-wide text-black transition-colors hover:bg-primary-strong sm:border-b-0 sm:border-r">
                  Start Free Trial
                  <ArrowUpRight size={16} strokeWidth={1.8} />
                </button>
                <button className="flex items-center justify-center gap-2 px-6 py-4 text-xs font-medium tracking-wide text-heading transition-colors hover:bg-surface-2">
                  Book Live Demo
                  <ArrowUpRight size={16} strokeWidth={1.8} />
                </button>
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
                  Trusted by teams running high-throughput APIs across fintech, logistics, and
                  health-tech.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}