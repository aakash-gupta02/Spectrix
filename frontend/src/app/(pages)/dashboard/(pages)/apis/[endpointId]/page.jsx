"use client";

import Container from "@/components/dashboard/common/Container";
import DashboardButton from "@/components/ui/DashboardButton";
import { endpointMetricsAPI } from "@/lib/api/api";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock3, RefreshCw, ShieldCheck, Activity, Zap, TrendingUp, Gauge, CheckCircle2, XCircle } from "lucide-react";
import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const formatNumber = (value, fallback = "-") => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return fallback;
  }

  return new Intl.NumberFormat("en-US").format(Number(value));
};

const healthTone = {
  healthy: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  degraded: "border-rose-500/30 bg-rose-500/10 text-rose-300",
};

const trendTone = {
  up: "text-emerald-300",
  down: "text-rose-300",
  flat: "text-body",
};

function MetricCard({ label, value, subtext, icon: Icon, tone = "neutral" }) {
  const toneClass =
    tone === "success"
      ? "border-emerald-500/20 bg-emerald-500/5"
      : tone === "danger"
        ? "border-rose-500/20 bg-rose-500/5"
        : tone === "accent"
          ? "border-primary/20 bg-primary/5"
          : "border-border bg-surface-1";

  return (
    <div className={`rounded-lg border p-4 ${toneClass}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-[0.6875rem] uppercase tracking-[0.12em] text-muted">{label}</span>
        {Icon ? <Icon size={16} className="text-body" /> : null}
      </div>
      <div className="text-2xl font-light tracking-tight text-heading">{value}</div>
      {subtext ? <div className="mt-2 text-[0.6875rem] text-body">{subtext}</div> : null}
    </div>
  );
}

function TrendCard({ label, trend }) {
  if (!trend) return null;

  const direction = trend.direction || "flat";

  return (
    <div className="rounded-lg border border-border bg-surface-1 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-[0.6875rem] uppercase tracking-[0.12em] text-muted">{label}</span>
        <TrendingUp size={16} className={trendTone[direction] || "text-body"} />
      </div>
      <div className="text-xl font-light text-heading">{Number(trend.current || 0).toFixed(label === "Latency" ? 2 : 0)}</div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.6875rem] text-body">
        <span>Previous {Number(trend.previous || 0).toFixed(label === "Latency" ? 2 : 0)}</span>
        <span className={trendTone[direction] || "text-body"}>
          {direction}
          {typeof trend.deltaPercent === "number" ? ` ${trend.deltaPercent}%` : ""}
        </span>
      </div>
    </div>
  );
}

export default function ApiDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const endpointId = Array.isArray(params?.endpointId) ? params.endpointId[0] : params?.endpointId;

  const topLevelQuery = useQuery({
    queryKey: ["endpoint-metrics", endpointId, "top-level"],
    queryFn: () => endpointMetricsAPI.getTopLevelMetrics(endpointId),
    enabled: Boolean(endpointId),
  });

  const timeSeriesQuery = useQuery({
    queryKey: ["endpoint-metrics", endpointId, "timeseries"],
    queryFn: () => endpointMetricsAPI.getTimeSeries(endpointId),
    enabled: Boolean(endpointId),
  });

  const metrics = topLevelQuery.data?.metrics ?? topLevelQuery.data?.overview;
  const kpis = metrics?.kpis ?? metrics?.summary ?? {};
  const timeseriesMetrics = timeSeriesQuery.data?.metrics ?? timeSeriesQuery.data?.overview;
  const series = useMemo(() => timeseriesMetrics?.timeseries ?? [], [timeseriesMetrics?.timeseries]);
  const trends = timeseriesMetrics?.trends;

  const derived = useMemo(() => {
    const maxTotal = Math.max(...series.map((item) => Number(item.total || 0)), 1);
    const maxLatency = Math.max(...series.map((item) => Number(item.avgLatency || 0)), 1);

    return { maxTotal, maxLatency };
  }, [series]);

  const endpointLabel = metrics?.endpoint?.name || "Endpoint details";
  const method = metrics?.endpoint?.method || "-";
  const path = metrics?.endpoint?.path || "-";
  const healthStatus = kpis?.healthStatus || metrics?.healthStatus || "unknown";
  const latestCheck = metrics?.latestCheck;

  return (
    <Container>
      <div className="mb-6 flex flex-col gap-4 rounded-lg border border-dashed border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-5 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
            <button
              type="button"
              onClick={() => router.push("/dashboard/apis")}
              className="inline-flex items-center gap-2 rounded border border-border bg-surface-1 px-3 py-1.5 text-body transition-colors hover:border-primary/40 hover:bg-primary-soft hover:text-primary"
            >
              <ArrowLeft size={13} />
              Back to APIs
            </button>
            <span className="rounded border border-border bg-surface-1 px-3 py-1.5">API Details</span>
          </div>

          <div>
            <h1 className="text-3xl font-light tracking-tight text-heading md:text-4xl">{endpointLabel}</h1>
            <p className="mt-2 max-w-3xl text-sm text-body">
              Endpoint health, traffic, and latency for the last 24 hours. Configuration, incidents, and charts are intentionally hidden for now.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded border border-border bg-surface-1 px-3 py-1.5 text-[0.6875rem] text-heading">
              <span className={`inline-flex rounded px-2 py-0.5 font-mono text-[0.625rem] uppercase ${method === "GET" ? "bg-sky-500/10 text-sky-300" : method === "POST" ? "bg-emerald-500/10 text-emerald-300" : method === "PUT" ? "bg-amber-500/10 text-amber-300" : method === "PATCH" ? "bg-violet-500/10 text-violet-300" : method === "DELETE" ? "bg-rose-500/10 text-rose-300" : "bg-white/5 text-body"}`}>
                {method}
              </span>
              <span className="font-mono text-xs text-body">{path}</span>
            </span>
            <span className={`inline-flex items-center gap-2 rounded border px-3 py-1.5 text-[0.6875rem] uppercase tracking-[0.12em] ${healthTone[healthStatus] || "border-border bg-surface-1 text-body"}`}>
              <ShieldCheck size={13} />
              {healthStatus}
            </span>
            {metrics?.timeWindow ? (
              <span className="inline-flex items-center gap-2 rounded border border-border bg-surface-1 px-3 py-1.5 text-[0.6875rem] text-body">
                <Clock3 size={13} />
                Last {metrics.timeWindow.hours} hours
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DashboardButton
            variant="secondary"
            onClick={() => {
              topLevelQuery.refetch();
              timeSeriesQuery.refetch();
            }}
          >
            <RefreshCw size={14} />
            Refresh
          </DashboardButton>
        </div>
      </div>

      {topLevelQuery.isLoading || timeSeriesQuery.isLoading ? (
        <div className="rounded-lg border border-border bg-surface-1 px-5 py-6 text-body">Loading endpoint metrics...</div>
      ) : null}

      {topLevelQuery.isError || timeSeriesQuery.isError ? (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-rose-200">
          Could not load endpoint metrics.
        </div>
      ) : null}

      {metrics ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Total checks"
              value={formatNumber(kpis?.totalChecks)}
              subtext={`Success ${formatNumber(kpis?.successChecks)} / Failure ${formatNumber(kpis?.failureChecks)}`}
              icon={Activity}
              tone="accent"
            />
            <MetricCard
              label="Success rate"
              value={`${formatNumber(kpis?.successRate)}%`}
              subtext={`Failure rate ${formatNumber(kpis?.failureRate)}%`}
              icon={CheckCircle2}
              tone="success"
            />
            <MetricCard
              label="Average latency"
              value={`${formatNumber(kpis?.avgLatency)} ms`}
              subtext={`P95 latency ${formatNumber(kpis?.p95Latency)} ms`}
              icon={Gauge}
            />
            <MetricCard
              label="Latest check"
              value={latestCheck?.result || "-"}
              subtext={`${latestCheck?.statusCode || "-"} · ${formatNumber(latestCheck?.responseTime)} ms · ${formatDateTime(latestCheck?.checkedAt)}`}
              icon={latestCheck?.result === "success" ? CheckCircle2 : XCircle}
              tone={latestCheck?.result === "success" ? "success" : "danger"}
            />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <TrendCard label="Latency" trend={trends?.latency} />
            <TrendCard label="Success rate" trend={trends?.successRate} />
            <TrendCard label="Traffic" trend={trends?.traffic} />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="overflow-hidden rounded-lg border border-border bg-surface-1">
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <div>
                  <h2 className="text-sm uppercase tracking-[0.12em] text-heading">Time series</h2>
                  <p className="mt-1 text-[0.6875rem] text-body">Hourly traffic and latency breakdown for the selected time window.</p>
                </div>
                <span className="text-[0.6875rem] text-body">UTC</span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface-2 text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                      <th className="px-4 py-3 font-normal">Time</th>
                      <th className="px-4 py-3 font-normal">Requests</th>
                      <th className="px-4 py-3 font-normal">Success</th>
                      <th className="px-4 py-3 font-normal">Avg latency</th>
                      <th className="px-4 py-3 font-normal">Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {series.map((item) => {
                      const requestShare = Math.round(((Number(item.total || 0) / derived.maxTotal) * 100) || 0);
                      const latencyShare = Math.round(((Number(item.avgLatency || 0) / derived.maxLatency) * 100) || 0);

                      return (
                        <tr key={item.bucketStart || item.time} className="border-b border-border/60 last:border-b-0">
                          <td className="px-4 py-3 text-heading">{item.time}</td>
                          <td className="px-4 py-3 text-body">{formatNumber(item.total)}</td>
                          <td className="px-4 py-3 text-body">{formatNumber(item.success)}</td>
                          <td className="px-4 py-3 text-body">{formatNumber(item.avgLatency)} ms</td>
                          <td className="px-4 py-3">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[0.625rem] text-body">
                                <span>Load {requestShare}%</span>
                                <span>Latency {latencyShare}%</span>
                              </div>
                              <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                                <div
                                  className="h-full rounded-full bg-primary/80"
                                  style={{ width: `${Math.max(requestShare, 0)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-surface-1 p-5">
                <div className="mb-4 flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                  <Zap size={14} />
                  Endpoint snapshot
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-body">Endpoint</span>
                    <span className="text-right text-heading">{metrics.endpoint?.name || "-"}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-body">Method</span>
                    <span className="text-right text-heading">{metrics.endpoint?.method || "-"}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-body">Path</span>
                    <span className="max-w-[60%] text-right font-mono text-xs text-heading">{metrics.endpoint?.path || "-"}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-body">Window</span>
                    <span className="text-right text-heading">{metrics.timeWindow?.hours || "-"} hours</span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-body">From</span>
                    <span className="text-right text-heading">{formatDateTime(metrics.timeWindow?.from)}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-body">To</span>
                    <span className="text-right text-heading">{formatDateTime(metrics.timeWindow?.to)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-surface-1 p-5">
                <div className="mb-4 flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                  <Activity size={14} />
                  Latest check
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-body">Result</span>
                    <span className="text-heading">{latestCheck?.result || "-"}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-body">Status code</span>
                    <span className="text-heading">{latestCheck?.statusCode || "-"}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-body">Response time</span>
                    <span className="text-heading">{formatNumber(latestCheck?.responseTime)} ms</span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-body">Checked at</span>
                    <span className="text-right text-heading">{formatDateTime(latestCheck?.checkedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </Container>
  );
}
