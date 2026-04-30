import Link from "next/link";
import React from "react";

const Guide = () => {
  return (
    <section
      id="api-monitoring-tool"
      className="scroll-mt-24 border-b border-dashed border-white/10 bg-page py-24"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 bg-surface-2 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-primary">
            Guide
          </div>
          <h2 className="max-w-3xl text-4xl font-light leading-[1.05] tracking-tighter text-heading sm:text-5xl lg:text-6xl">
            Understand API monitoring
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-body-strong sm:text-lg">
            API monitoring helps developers track uptime, latency, and errors
            across production endpoints. Spectrix provides real-time visibility
            with alerts so you can respond before issues impact users.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/api-monitoring-tool"
              className="inline-flex items-center justify-center border border-primary bg-primary px-5 py-3 text-xs font-medium uppercase tracking-wide text-black transition-colors hover:bg-primary-strong"
            >
              Read the full guide
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center border border-border bg-surface-1 px-5 py-3 text-xs font-medium uppercase tracking-wide text-heading transition-colors hover:bg-white/5"
            >
              Open dashboard
            </Link>
          </div>
        </div>

        <div className="border border-dashed border-white/10 bg-surface-1 p-6">
          <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
            Why it matters
          </h3>
          <div className="mt-6 space-y-5">
            {[
              {
                title: "Uptime",
                text: "Keep a close watch on endpoint availability.",
              },
              {
                title: "Latency",
                text: "Spot response-time regressions before they affect users.",
              },
              {
                title: "Alerts",
                text: "Notify teams via Slack, Discord, or webhooks.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border-b border-dashed border-white/10 pb-4 last:border-0 last:pb-0"
              >
                <h4 className="text-base font-medium text-heading">
                  {item.title}
                </h4>
                <p className="mt-1 text-sm leading-relaxed text-body">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Guide;
