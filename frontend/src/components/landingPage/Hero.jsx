import React from "react";
import {
  ArrowUpRight,
  Bell,
  ChartNoAxesColumn,
  CodeSquare,
  Ellipsis,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="hero" className="grid scroll-mt-24 grid-cols-1 border-b border-dashed border-white/10 lg:grid-cols-2">
      <div className="relative flex flex-col justify-center overflow-hidden border-r border-dashed border-white/10 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-slate-900/40 via-page to-page px-6 py-16 lg:px-20 lg:py-24">


        <div className="relative z-10 max-w-2xl">
          <div className="mb-6 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            <p className="font-mono text-xs uppercase tracking-widest text-body">
              Lightweight API monitoring for developers
            </p>
          </div>

          <h1 className="mb-8 text-5xl font-light leading-[1.1] tracking-tighter text-heading sm:text-6xl lg:text-7xl">
            Monitor API health
            <br />
            without heavyweight
            <br />
            <span className="font-light tracking-tighter text-body">observability overhead.</span>
          </h1>

          <p className="mb-12 max-w-lg text-lg font-light leading-relaxed text-body-strong sm:text-xl">
            Spectrix helps backend teams monitor endpoint uptime, latency, and errors, then sends
            real-time alerts to Slack, Discord, or webhooks when something breaks.
          </p>

          <div className="grid max-w-lg grid-cols-1 overflow-hidden rounded-sm border border-dashed border-white/10 sm:grid-cols-2">
            <Link
              href="/dashboard"
              className="group flex items-center justify-center gap-3 border-b border-r border-dashed border-white/10 px-8 py-5 transition-all duration-300 hover:bg-primary/5 sm:border-b-0"
            >
              <span className="text-xs font-normal uppercase tracking-wide text-primary">
                Start Free Trial
              </span>
            </Link>

            <Link
              href="#how-it-works"
              className="group flex items-center justify-center gap-3 px-8 py-5 transition-all duration-300 hover:bg-white/5"
            >
              <span className="text-xs font-normal uppercase tracking-wide text-heading">How It Works</span>
              <ArrowUpRight
                size={16}
                strokeWidth={1.5}
                className="text-white transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
          <p className="mt-4 text-xs text-body">No credit card required. Setup in under 10 minutes.</p>
        </div>
      </div>

      <div
        className="relative z-10 overflow-hidden bg-linear-to-r from-primary to-black"
        style={{
          maskImage: "linear-gradient(210deg, transparent, black 0%, black 100%, transparent)",
          WebkitMaskImage:
            "linear-gradient(210deg, transparent, black 0%, black 100%, transparent)",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-page to-page opacity-40" />
        <div className="pointer-events-none absolute right-0 top-0 h-150 w-150 rounded-full bg-primary/5 blur-[120px]" />

        <div className="relative z-10 flex h-full items-center justify-center p-8 lg:p-16">
          <div className="flex h-150 w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-white/10 bg-surface-2 shadow-2xl backdrop-blur-xl md:h-125 md:flex-row">
            <div className="flex w-full flex-col border-r border-white/5 bg-surface-1/60 p-4 md:w-64">
              <div className="mb-8 flex items-center gap-3 px-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-primary font-medium text-black">
                  P
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-heading">Production App</span>
                  <span className="text-[10px] text-slate-500">US-East Region</span>
                </div>
              </div>

              <div className="no-scrollbar flex-1 space-y-1 overflow-y-auto">
                <div className="cursor-pointer rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-normal text-primary">
                  <div className="flex items-center gap-3">
                    <LayoutDashboard size={16} strokeWidth={1.5} />
                    Overview
                  </div>
                </div>
                <div className="cursor-pointer px-3 py-2 text-xs text-slate-500 hover:text-slate-300">
                  <div className="flex items-center gap-3">
                    <CodeSquare size={16} strokeWidth={1.5} />
                    Endpoints
                  </div>
                </div>
                <div className="cursor-pointer px-3 py-2 text-xs text-slate-500 hover:text-slate-300">
                  <div className="flex items-center gap-3">
                    <ChartNoAxesColumn size={16} strokeWidth={1.5} />
                    Latency
                  </div>
                </div>
                <div className="cursor-pointer px-3 py-2 text-xs text-slate-500 hover:text-slate-300">
                  <div className="flex items-center gap-3">
                    <Bell size={16} strokeWidth={1.5} />
                    Alerts
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex flex-1 flex-col bg-transparent p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-sm font-normal text-heading">Total Requests</h3>
                <span className="rounded border border-white/5 bg-white/5 px-2 py-1 text-[10px] text-slate-400">
                  Real-time
                </span>
              </div>

              <div className="mb-8">
                <div className="mb-1 text-4xl font-light tracking-tighter text-heading">245,892,104</div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="rounded bg-primary/10 px-1 text-primary">99.99%</span>
                  Uptime SLA
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="rounded-lg border border-white/5 bg-surface-3/60 p-5">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <div className="mb-1 text-xs text-slate-400">Avg Response Time</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-normal text-heading">42ms</span>
                      </div>
                    </div>
                    <Ellipsis size={16} className="text-slate-600" />
                  </div>

                  <div className="relative mt-2 h-32 w-full">
                    <div className="absolute inset-0 flex flex-col justify-between text-[10px] font-mono text-slate-700">
                      <div className="h-0 w-full border-b border-white/5" />
                      <div className="h-0 w-full border-b border-white/5" />
                      <div className="h-0 w-full border-b border-white/5" />
                      <div className="h-0 w-full border-b border-white/5" />
                    </div>

                    <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#c6f91f" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#c6f91f" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,80 C40,75 80,90 120,60 C160,30 200,45 240,20 C280,5 300,15 310,5 L310,128 L0,128 Z"
                        fill="url(#chartGradient)"
                      />
                      <path
                        d="M0,80 C40,75 80,90 120,60 C160,30 200,45 240,20 C280,5 300,15 310,5"
                        fill="none"
                        stroke="#c6f91f"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                      />
                      <circle cx="98%" cy="5%" r="3" fill="#c6f91f" stroke="#05080A" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
