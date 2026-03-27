import { Activity, AlertTriangle, Clock3, Server } from "lucide-react";

const topMetrics = [
  {
    title: "Total APIs",
    value: "18",
    meta: "+3 this month",
    icon: Server,
  },
  {
    title: "Average Uptime",
    value: "99.94%",
    meta: "SLA target 99.90%",
    icon: Activity,
  },
  {
    title: "Avg Response",
    value: "241ms",
    meta: "-18ms vs yesterday",
    icon: Clock3,
  },
  {
    title: "Incidents",
    value: "2",
    meta: "1 critical in last 7d",
    icon: AlertTriangle,
  },
];

export default function DashboardPage() {
  return (
    <section className="w-full px-4 pb-10 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-1 text-3xl font-light tracking-tight text-heading sm:text-4xl">
              API Monitoring Overview
            </h1>
            <p className="text-xs text-body">
              Real-time uptime, response time, incidents, and performance signals.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded border border-border px-3 py-1.5 text-[0.75rem] text-body transition-colors hover:bg-white/5"
            >
              Export report
            </button>
            <button
              type="button"
              className="rounded border border-primary/40 bg-primary-soft px-3 py-1.5 text-[0.75rem] text-primary transition-colors hover:bg-primary/20"
            >
              Create monitor
            </button>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topMetrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <article
                key={metric.title}
                className="rounded-lg border border-dashed border-border bg-page p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[0.6875rem] uppercase tracking-[0.15em] text-white/45">
                    {metric.title}
                  </p>
                  <Icon size={16} className="text-primary" />
                </div>
                <p className="text-3xl font-light tracking-tight text-heading">{metric.value}</p>
                <p className="mt-1 text-[0.6875rem] text-body">{metric.meta}</p>
              </article>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <article className="rounded-lg border border-dashed border-border bg-page p-4 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm text-heading">Response Time Trend</h2>
              <span className="text-[0.6875rem] text-body">Last 24 hours</span>
            </div>

            <div className="relative h-40 overflow-hidden rounded border border-border bg-surface-1">
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(198,249,31,0.12),transparent)]" />
              <div className="absolute inset-x-0 bottom-0 h-px bg-border" />
              <div className="absolute left-0 right-0 top-1/2 h-px border-t border-dashed border-border" />
              <div className="absolute left-0 right-0 top-1/4 h-px border-t border-dashed border-border" />
              <div className="absolute left-0 right-0 top-3/4 h-px border-t border-dashed border-border" />
              <div className="absolute inset-x-4 bottom-10 h-14 rounded-full border border-primary/30" />
            </div>
          </article>

          <article className="rounded-lg border border-dashed border-border bg-page p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm text-heading">Latest Incidents</h2>
              <span className="text-[0.6875rem] text-body">This week</span>
            </div>

            <div className="space-y-3">
              <div className="rounded border border-rose-500/25 bg-rose-500/5 p-3">
                <p className="text-xs text-rose-300">Payment API timeout spike</p>
                <p className="mt-1 text-[0.6875rem] text-body">Resolved in 17m</p>
              </div>
              <div className="rounded border border-amber-400/25 bg-amber-400/5 p-3">
                <p className="text-xs text-amber-300">Webhook retries elevated</p>
                <p className="mt-1 text-[0.6875rem] text-body">Monitoring active</p>
              </div>
              <div className="rounded border border-emerald-500/25 bg-emerald-500/5 p-3">
                <p className="text-xs text-emerald-300">Public status page stable</p>
                <p className="mt-1 text-[0.6875rem] text-body">No disruption</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}