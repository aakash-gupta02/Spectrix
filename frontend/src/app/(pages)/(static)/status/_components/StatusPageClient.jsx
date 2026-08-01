"use client";

import { useEffect, useState } from "react";
// import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { statuspageAPI } from "@/lib/api/api";
import { Check, Server, TriangleAlert, Zap } from "lucide-react";
import Link from "next/link";

const BADGE = {
  green: "border-green-500 bg-green-50 text-green-700",
  yellow: "border-yellow-500 bg-yellow-50 text-yellow-800",
  orange: "border-orange-500 bg-orange-50 text-orange-700",
  red: "border-red-500 bg-red-50 text-red-700",
  gray: "border-slate-400 bg-slate-50 text-slate-600",
};

const DOT = {
  green: "border-green-500 bg-green-100 text-green-500",
  yellow: "border-yellow-500 bg-yellow-100 text-yellow-500",
  orange: "border-orange-500 bg-orange-100 text-orange-500",
  red: "border-red-500 bg-red-100 text-red-500",
  gray: "border-slate-400 bg-slate-100 text-slate-400",
};

const BAR = {
  operational: "border-emerald-600 bg-emerald-500",
  degraded: "border-yellow-600 bg-yellow-400",
  partial_outage: "border-amber-600 bg-amber-400",
  major_outage: "border-red-600 bg-red-500",
  no_data: "border-slate-400 bg-slate-100",
};

const STATUS_META = {
  operational: {
    label: "Operational",
    tone: "green",
    hero: "All services are online",
  },
  degraded: {
    label: "Degraded",
    tone: "yellow",
    hero: "Some services are degraded",
  },
  partial_outage: {
    label: "Partial Outage",
    tone: "orange",
    hero: "Partial outage in progress",
  },
  major_outage: {
    label: "Major Outage",
    tone: "red",
    hero: "Major outage in progress",
  },
  no_data: {
    label: "No Data",
    tone: "gray",
    hero: "Status unavailable",
  },
};

const INCIDENT_META = {
  investigating: { label: "Investigating", tone: "orange" },
  identified: { label: "Identified", tone: "yellow" },
  monitoring: { label: "Monitoring", tone: "yellow" },
  resolved: { label: "Resolved", tone: "green" },
};

const OVERALL_PRIORITY = [
  "major_outage",
  "partial_outage",
  "degraded",
  "no_data",
  "operational",
];

const badgeClass = (tone) =>
  `inline-flex items-center whitespace-nowrap rounded-none border border-dashed px-3 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide ${BADGE[tone] || BADGE.gray}`;

const dotClass = (tone) =>
  `mr-1.5 inline-block h-2.5 w-2.5 shrink-0 rounded-none border border-dashed ${DOT[tone] || DOT.gray}`;

const cardClass =
  "rounded-none border border-dashed border-status-line bg-status-card shadow-status-card transition-[border-color,box-shadow] hover:border-slate-400";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelative(date) {
  const diffMs = Date.now() - new Date(date).getTime();
  const mins = Math.max(0, Math.floor(diffMs / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function getCurrentStatus(history = []) {
  if (!history.length) return "no_data";
  return history[history.length - 1]?.status || "no_data";
}

function calculateUptime(history = []) {
  const scored = history.filter(
    (h) => h.status !== "no_data" && h.uptime != null,
  );
  if (!scored.length) return "100.00";
  const sum = scored.reduce((acc, h) => acc + Number(h.uptime), 0);
  return (sum / scored.length).toFixed(2);
}

function getOverallStatus(services = []) {
  let worst = "operational";
  for (const service of services) {
    const status = getCurrentStatus(service.history);
    if (OVERALL_PRIORITY.indexOf(status) < OVERALL_PRIORITY.indexOf(worst)) {
      worst = status;
    }
  }
  return STATUS_META[worst] || STATUS_META.operational;
}

function getOverallUptime(services = []) {
  const all = services.flatMap((s) => s.history || []);
  const scored = all.filter((h) => h.status !== "no_data" && h.uptime != null);
  if (!scored.length) return "100.000";
  const sum = scored.reduce((acc, h) => acc + Number(h.uptime), 0);
  return (sum / scored.length).toFixed(3);
}

function getActiveIncidents(services = []) {
  const seen = new Set();
  const incidents = [];

  for (const service of services) {
    const incident = service.activeIncident;
    if (!incident) continue;
    const key = incident._id || `${service._id}-${incident.startedAt}`;
    if (seen.has(key)) continue;
    seen.add(key);
    incidents.push({ ...incident, serviceName: service.name });
  }

  return incidents;
}

function formatDuration(startedAt, resolvedAt) {
  if (!startedAt) return null;
  const end = resolvedAt ? new Date(resolvedAt) : new Date();
  const mins = Math.max(1, Math.round((end - new Date(startedAt)) / 60000));
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"}`;
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  if (!rem) return `${hours} hour${hours === 1 ? "" : "s"}`;
  return `${hours}h ${rem}m`;
}

function barTooltip(entry) {
  const dateLabel = formatDate(entry.date);

  if (entry.incident) {
    const status =
      INCIDENT_META[entry.incident.publicStatus]?.label ||
      entry.incident.publicStatus ||
      "Incident";
    const duration = formatDuration(
      entry.incident.startedAt,
      entry.incident.resolvedAt,
    );
    return duration
      ? `${dateLabel} · ${status} · ${duration}`
      : `${dateLabel} · ${status}`;
  }

  if (entry.uptime == null || entry.status === "no_data") {
    return `${dateLabel} · No data`;
  }

  const uptime =
    Number(entry.uptime) % 1 === 0
      ? `${Number(entry.uptime)}%`
      : `${Number(entry.uptime).toFixed(1)}%`;

  return `${dateLabel} · ${uptime} uptime`;
}

function UptimeBar({ entry }) {
  const hasIncident = Boolean(entry.incident?.id || entry.incident?._id);
  // const incidentId = entry.incident?.id || entry.incident?._id;
  const tooltip = barTooltip(entry);
  const className = [
    "status-uptime-bar",
    BAR[entry.status] || BAR.no_data,
    hasIncident ? "cursor-pointer" : "cursor-default",
  ].join(" ");

  // Incident bars will link to a public incident detail page.
  // Uncomment when the route exists:
  // if (hasIncident) {
  //   return (
  //     <Link
  //       href={`/status/incidents/${incidentId}`}
  //       className={className}
  //       data-tooltip={tooltip}
  //       aria-label={tooltip}
  //       onClick={(e) => e.stopPropagation()}
  //     />
  //   );
  // }

  return (
    <span
      role={hasIncident ? "button" : undefined}
      tabIndex={hasIncident ? 0 : undefined}
      className={className}
      data-tooltip={tooltip}
      aria-label={tooltip}
      // onClick={
      //   hasIncident
      //     ? () => router.push(`/status/incidents/${incidentId}`)
      //     : undefined
      // }
    />
  );
}

function UptimeBars({ history = [] }) {
  const bars = history.slice(-90);

  return (
    <div>
      <div className="status-uptime-grid">
        {bars.map((entry, index) => (
          <UptimeBar key={`${entry.date}-${index}`} entry={entry} />
        ))}
      </div>
      <div className="mt-3 flex justify-between text-sm text-status-muted">
        <span>90 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}

function Chevron({ open }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 text-status-muted transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

function ServiceCard({ service, expanded, onToggle }) {
  const status = getCurrentStatus(service.history);
  const meta = STATUS_META[status] || STATUS_META.operational;
  const uptime = calculateUptime(service.history);

  return (
    <div className={`${cardClass} mb-3 overflow-visible`}>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 bg-transparent px-5 py-4 text-left text-inherit transition-colors hover:bg-[#fafcff]"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className={dotClass(meta.tone)} />
          <div className="min-w-0">
            <div className="truncate font-semibold text-status-ink">
              {service.name}
            </div>
            <div className="mt-0.5 text-sm text-status-muted md:hidden">
              {uptime}% uptime
            </div>
          </div>
          <span className={`${badgeClass(meta.tone)} hidden sm:inline-flex`}>
            {meta.label}
          </span>
          <span className="hidden text-sm text-status-muted md:inline">
            {uptime}% uptime
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className={`${badgeClass(meta.tone)} sm:hidden`}>
            {meta.label}
          </span>
          <Chevron open={expanded} />
        </div>
      </button>

      {expanded ? (
        <div className="overflow-visible border-t border-dashed border-status-line-soft px-5 pb-6 pt-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-status-ink">
                {service.name}
              </h3>
              <p className="text-sm text-status-muted">90 day availability</p>
            </div>
            <span className={badgeClass(meta.tone)}>{meta.label}</span>
          </div>
          <UptimeBars history={service.history} />
        </div>
      ) : null}
    </div>
  );
}

const StatusPageClient = ({ slug }) => {
  const [expandedIds, setExpandedIds] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      statuspageAPI.trackStatusPageVisit(slug).catch((err) => {
        console.error("Failed to track status page visit:", err);
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [slug]);

  const { data, isLoading, error, dataUpdatedAt } = useQuery({
    queryKey: ["statuspage", slug],
    queryFn: () => statuspageAPI.getStatusPageBySlug(slug),
    refetchInterval: 60_000,
  });

  const statusPage = data?.statuspage || data?.data?.statuspage || null;
  const services = [...(statusPage?.services || [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );
  const firstServiceId = services[0]?._id;
  const resolvedExpandedIds =
    expandedIds ?? (firstServiceId ? new Set([firstServiceId]) : new Set());

  const toggleService = (id) => {
    setExpandedIds((prev) => {
      const base =
        prev ?? (firstServiceId ? new Set([firstServiceId]) : new Set());
      const next = new Set(base);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-status-page font-body text-status-body antialiased">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-11 w-11 animate-spin rounded-none border-2 border-dashed border-slate-400 border-t-transparent" />
            <p className="mt-4 text-status-muted">Loading status...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !statusPage) {
    return (
      <div className="min-h-screen bg-status-page font-body text-status-body antialiased">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center border-2 border-dashed border-red-400 bg-red-50/80">
              <svg
                className="h-8 w-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-bold text-status-ink">
              Status page not found
            </h2>
            <p className="mt-2 text-status-muted">
              This page may be private or the link is incorrect.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const overall = getOverallStatus(services);
  const overallUptime = getOverallUptime(services);
  const activeIncidents = getActiveIncidents(services);
  const updatedLabel = dataUpdatedAt
    ? formatRelative(dataUpdatedAt)
    : "just now";

  const heroTone = {
    green: "border-emerald-400 bg-emerald-50/80 text-emerald-600",
    yellow: "border-yellow-400 bg-yellow-50/80 text-yellow-600",
    orange: "border-orange-400 bg-orange-50/80 text-orange-600",
    red: "border-red-400 bg-red-50/80 text-red-600",
    gray: "border-slate-400 bg-slate-50/80 text-slate-600",
  };

  return (
    <div className="min-h-screen bg-status-page font-body text-status-body antialiased">
      <div className="mx-auto max-w-status px-6 py-10 md:py-14">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-dashed border-status-line pb-6">
          <div className="flex items-center gap-3">
            {statusPage.logoUrl ? (
              <img
                src={statusPage.logoUrl}
                alt={statusPage.name}
                className="h-10 w-auto"
              />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center border-2 border-dashed border-slate-400 bg-white text-xl font-bold tracking-tight text-status-body">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </span>
            )}
            <span className="border-b-2 border-dashed border-slate-400 pb-0.5 text-2xl font-semibold tracking-tight text-status-ink">
              {statusPage.name}
            </span>
          </div>
          <div className="flex items-center gap-1.5 border border-dashed border-status-line bg-white/60 px-3 py-1.5 text-xs text-status-muted">
            {/* <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg> */}
            <Zap className="h-3.5 w-3.5" />
            <span>Powered by</span>
            <Link
              href="/"
              className="font-medium Link-status-body"
              target="_blank"
              rel="noopener noreferrer"
            >
              Spectrix
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="py-12 text-center md:py-16">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center border-2 border-dashed ${heroTone[overall.tone] || heroTone.green}`}
          >
            {overall.tone === "green" ? (
              <Check className="h-8 w-8" />
            ) : (
              <TriangleAlert className="h-8 w-8" />
            )}
          </div>
          <h1 className="mt-6 text-3xl font-extrabold text-status-ink sm:text-4xl md:text-5xl">
            {overall.hero}
          </h1>
          {statusPage.description ? (
            <p className="mx-auto mt-3 max-w-2xl text-status-muted">
              {statusPage.description}
            </p>
          ) : null}
          <p className="mt-3 text-status-muted">Last updated {updatedLabel}</p>
        </section>

        {/* Services */}
        <section className="mb-12">
          <h2 className="mb-5 flex items-center gap-2.5 text-xl font-bold text-status-ink">
            <Server className="h-4 w-4 text-status-soft" />
            Services
            <span className={`${badgeClass("gray")} ml-1`}>Monitored</span>
          </h2>

          {services.length === 0 ? (
            <div className={`${cardClass} p-6 text-sm text-status-muted`}>
              No services are listed on this status page yet.
            </div>
          ) : (
            <div>
              {services.map((service) => (
                <ServiceCard
                  key={service._id}
                  service={service}
                  expanded={resolvedExpandedIds.has(service._id)}
                  onToggle={() => toggleService(service._id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Active Incidents */}
        <section className="mb-12">
          <h2 className="mb-5 flex items-center gap-2.5 text-xl font-bold text-status-ink">
            <TriangleAlert className="h-4 w-4 text-status-soft" />
            Active Incidents
            {activeIncidents.length > 0 ? (
              <span className={`${badgeClass("orange")} ml-1`}>
                {activeIncidents.length}
              </span>
            ) : (
              <span className={`${badgeClass("green")} ml-1`}>None</span>
            )}
          </h2>

          {activeIncidents.length === 0 ? (
            <div className={`${cardClass} p-6 text-sm text-status-muted`}>
              No active incidents right now.
            </div>
          ) : (
            <div className="space-y-4">
              {activeIncidents.map((incident) => {
                const meta =
                  INCIDENT_META[incident.publicStatus] ||
                  INCIDENT_META.investigating;
                return (
                  <button
                    key={incident._id}
                    type="button"
                    className="w-full cursor-pointer rounded-none border border-dashed border-orange-500 bg-[#fffbf5] p-5 text-left transition-colors hover:bg-orange-50"
                    onClick={() => setSelectedIncident(incident)}
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div>
                        <h3 className="flex items-center gap-2 text-lg font-bold text-status-ink">
                          <svg
                            className="h-5 w-5 text-orange-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {incident.description ||
                            `${incident.serviceName} incident`}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                          <span className="flex items-center font-medium text-orange-700">
                            <span className={dotClass(meta.tone)} />
                            {meta.label}
                          </span>
                          <span className="text-status-soft">
                            {incident.serviceName}
                          </span>
                          <span className="text-status-soft">
                            Started:{" "}
                            {incident.startedAt
                              ? `${formatDate(incident.startedAt)} · ${formatTime(incident.startedAt)}`
                              : "Unknown"}
                          </span>
                        </div>
                      </div>
                      <span className={badgeClass(meta.tone)}>
                        {meta.label}
                      </span>
                    </div>
                    {incident.description ? (
                      <p className="mt-3 border-t border-dashed border-orange-200/70 pt-3 text-sm leading-relaxed text-status-body">
                        {incident.description}
                      </p>
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-6 border-t border-dashed border-status-line pt-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-status-muted">
                  Overall Uptime
                </div>
                <div className="text-[2.6rem] font-semibold leading-none tracking-tight text-status-body sm:text-[3.2rem]">
                  {overallUptime}%
                </div>
              </div>
              <div className="hidden h-10 w-px bg-status-line sm:block" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-status-muted">
                  Last updated
                </div>
                <div className="text-lg font-medium text-status-ink">
                  {updatedLabel}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 border border-dashed border-slate-300 bg-white/60 px-4 py-2 text-sm text-status-soft">
              <span>Powered by</span>
              <Link
                href="/"
                className="font-semibold text-status-ink"
                target="_blank"
                rel="noopener noreferrer"
              >
                Spectrix
              </Link>
            </div>
          </div>
          <hr className="mt-6 border-0 border-t border-dashed border-status-line" />
          <div className="mt-4 text-center text-xs tracking-wide text-slate-500">
            © {new Date().getFullYear()} Spectrix · Real-time status for your
            APIs
          </div>
        </footer>
      </div>

      {/* Selected Incident */}
      {selectedIncident ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4"
          onClick={() => setSelectedIncident(null)}
        >
          <div
            className="w-full max-w-lg rounded-none border-2 border-dashed border-slate-400 bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-xl font-bold text-status-ink">
                Incident details
              </h3>
              <button
                type="button"
                onClick={() => setSelectedIncident(null)}
                className="text-status-muted hover:text-status-ink"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-status-muted">Service</span>
                <p className="font-medium text-status-ink">
                  {selectedIncident.serviceName}
                </p>
              </div>
              <div>
                <span className="text-status-muted">Description</span>
                <p className="font-medium text-status-ink">
                  {selectedIncident.description || "No description"}
                </p>
              </div>
              <div>
                <span className="text-status-muted">Status</span>
                <p className="font-medium capitalize text-orange-700">
                  {selectedIncident.publicStatus || "investigating"}
                </p>
              </div>
              <div>
                <span className="text-status-muted">Started</span>
                <p className="font-medium text-status-ink">
                  {selectedIncident.startedAt
                    ? new Date(selectedIncident.startedAt).toLocaleString()
                    : "Unknown"}
                </p>
              </div>
              {selectedIncident.endpointId?.path ? (
                <div>
                  <span className="text-status-muted">Endpoint</span>
                  <p className="font-medium text-status-ink">
                    {selectedIncident.endpointId.name ||
                      selectedIncident.endpointId.path}
                  </p>
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setSelectedIncident(null)}
              className="mt-6 w-full border border-dashed border-slate-400 py-2 text-status-ink hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default StatusPageClient;
