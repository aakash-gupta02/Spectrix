import React from "react";
import {
  BellRing,
  Bug,
  CirclePlus,
  Globe,
  Route,
  Server,
} from "lucide-react";
import SectionHeading from "../common/SectionHeading";

export default function Features() {
  return (
    <section className="border-b border-dashed border-white/10 bg-page py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="01. Features"
          title="Comprehensive API observability."
          buttonTxt="View Features"
          description="From single endpoints to complex microservices, we provide the tools to ensure continuous reliability."
        />

        <section className="relative z-10 border-b border-dashed border-white/10 bg-page">
          <div className="grid grid-cols-1 border-b border-dashed border-white/10 md:grid-cols-12">
            <div className="col-span-12 flex flex-col justify-center border-b border-dashed border-white/10 p-8 md:col-span-4 md:border-b-0 md:border-r md:p-12">
              <div className="mb-4 flex items-center gap-2">
                <Server size={16} className="text-primary" strokeWidth={1.5} />
                <span className="font-mono text-xs uppercase tracking-widest text-primary">
                  Core Philosophy
                </span>
              </div>
              <h3 className="mb-4 text-3xl font-light tracking-tighter text-white md:text-4xl">
                Data that empowers.
              </h3>
              <p className="text-sm leading-relaxed text-white/70">
                We believe in proactive monitoring, not reactive debugging. Our platform is built
                to catch degradation before users do.
              </p>
            </div>

            <div className="col-span-12 grid grid-cols-1 divide-y divide-dashed divide-white/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 md:col-span-8">
              <div className="group relative overflow-hidden p-8 transition-colors hover:bg-white/2">
                <div className="relative mb-6 flex h-24 w-full flex-col overflow-hidden rounded border border-white/5 bg-slate-900/50 p-3">
                  <svg className="h-full w-full text-slate-600" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <path
                      d="M0 40 L10 35 L20 38 L30 30 L40 32 L50 20 L60 25 L70 15 L80 18 L90 5 L100 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                    />
                    <path
                      d="M0 40 L10 35 L20 38 L30 30 L40 32 L50 20 L60 25 L70 15 L80 18 L90 5 L100 10 L100 40 L0 40"
                      fill="url(#featureChartGradient)"
                      opacity="0.2"
                    />
                    <defs>
                      <linearGradient id="featureChartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#c6f91f" stopOpacity="1" />
                        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-colors group-hover:bg-primary/20" />
                </div>
                <h3 className="mb-2 flex items-center gap-2 font-normal text-white">
                  Endpoint Monitoring
                </h3>
                <p className="text-xs leading-relaxed text-white/70">
                  Track health, uptime, and response times across all your critical API endpoints
                  from global edge locations.
                </p>
              </div>

              <div className="group relative overflow-hidden p-8 transition-colors hover:bg-white/2">
                <div className="mb-6 flex h-24 w-full items-center justify-center">
                  <div className="relative flex h-full w-full items-center justify-center">
                    <div className="absolute h-px w-24 bg-linear-to-r from-transparent via-white/20 to-transparent" />
                    <div className="absolute h-16 w-px bg-linear-to-b from-transparent via-white/20 to-transparent" />
                    <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-surface-3 shadow-[0_0_15px_rgba(198,249,31,0.1)]">
                      <Route size={16} className="text-white" strokeWidth={1.5} />
                    </div>
                    <div className="absolute right-10 top-4 h-2 w-2 animate-pulse rounded-full bg-primary" />
                  </div>
                </div>
                <h3 className="mb-2 flex items-center gap-2 font-normal text-white">Latency Tracking</h3>
                <p className="text-xs leading-relaxed text-white/70">
                  Identify bottlenecks with detailed latency distribution and geographical routing
                  insights.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 border-b border-dashed border-white/10 divide-dashed divide-white/10 sm:grid-cols-2 sm:divide-x md:grid-cols-4">
            <div className="group flex flex-col gap-3 p-6 transition-colors hover:bg-white/2">
              <Bug size={20} className="text-slate-400 transition-colors group-hover:text-primary" strokeWidth={1.5} />
              <div>
                <h4 className="text-sm font-normal text-white">Error Tracking</h4>
                <p className="mt-1 text-[10px] text-slate-500">Capture and analyze failure rates.</p>
              </div>
            </div>

            <div className="group flex flex-col gap-3 p-6 transition-colors hover:bg-white/2">
              <BellRing size={20} className="text-slate-400 transition-colors group-hover:text-primary" strokeWidth={1.5} />
              <div>
                <h4 className="text-sm font-normal text-white">Alerting Rules</h4>
                <p className="mt-1 text-[10px] text-slate-500">Custom thresholds and triggers.</p>
              </div>
            </div>

            <div className="group flex flex-col gap-3 p-6 transition-colors hover:bg-white/2">
              <Globe size={20} className="text-slate-400 transition-colors group-hover:text-primary" strokeWidth={1.5} />
              <div>
                <h4 className="text-sm font-normal text-white">Global Locations</h4>
                <p className="mt-1 text-[10px] text-slate-500">Test from multiple regions globally.</p>
              </div>
            </div>

            <div className="group flex flex-col gap-3 p-6 transition-colors hover:bg-white/2">
              <CirclePlus size={20} className="text-slate-400 transition-colors group-hover:text-primary" strokeWidth={1.5} />
              <div>
                <h4 className="text-sm font-normal text-white">SLA Reporting</h4>
                <p className="mt-1 text-[10px] text-slate-500">Automated weekly uptime reports.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
