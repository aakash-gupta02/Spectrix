"use client";

import React from "react";

const IncidentTable = ({ incidents, incidentsQuery }) => {
  const formatDateTime = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatDuration = (startedAt, updatedAt, status) => {
    const start = new Date(startedAt);
    if (Number.isNaN(start.getTime())) {
      return "-";
    }

    const end = status === "open" ? new Date() : new Date(updatedAt || startedAt);
    if (Number.isNaN(end.getTime())) {
      return "-";
    }

    const minutes = Math.max(0, Math.floor((end.getTime() - start.getTime()) / 60000));
    if (minutes < 60) {
      return `${minutes} min${status === "open" ? "+" : ""}`;
    }

    const hours = Math.floor(minutes / 60);
    const remMinutes = minutes % 60;
    return `${hours}h ${remMinutes}m${status === "open" ? "+" : ""}`;
  };

  const getSeverity = (failureCount) => {
    if (failureCount >= 20) {
      return "critical";
    }
    if (failureCount >= 10) {
      return "high";
    }
    if (failureCount >= 5) {
      return "medium";
    }
    return "low";
  };

  const getSeverityBadgeClass = (severity) => {
    switch (severity) {
      case "critical":
        return "border-rose-500/35 bg-rose-500/10 text-rose-300";
      case "high":
        return "border-orange-500/35 bg-orange-500/10 text-orange-300";
      case "medium":
        return "border-amber-500/35 bg-amber-500/10 text-amber-300";
      default:
        return "border-sky-500/35 bg-sky-500/10 text-sky-300";
    }
  };

  const getEnvShortLabel = (environment) => {
    switch ((environment || "").toLowerCase()) {
      case "development":
      case "dev":
        return "dev";
      case "production":
      case "prod":
        return "prod";
      case "staging":
      case "stage":
      case "stag":
        return "stag";
      default:
        return (environment || "-").toLowerCase();
    }
  };

  const getEndpointDetails = (incident) => {
    const endpoint = incident?.endpointId;

    if (endpoint && typeof endpoint === "object") {
      return {
        name: endpoint.name || "Unnamed endpoint",
        path: endpoint.path || endpoint.urlPath || "-",
      };
    }

    return {
      name: endpoint || "-",
      path: "-",
    };
  };

  const getServiceDetails = (incident) => {
    const service = incident?.serviceId;

    if (service && typeof service === "object") {
      return {
        name: service.name || "Unnamed service",
        env: getEnvShortLabel(service.environment),
      };
    }

    return {
      name: service || "-",
      env: "-",
    };
  };

  const getStatusBadgeClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "open":
        return "border-rose-500/35 bg-rose-500/10 text-rose-300";
      case "closed":
        return "border-emerald-500/35 bg-emerald-500/10 text-emerald-300";
      case "resolved":
        return "border-emerald-500/35 bg-emerald-500/10 text-emerald-300";
      default:
        return "border-slate-500/35 bg-slate-500/10 text-slate-300";
    }
  };

  return (
    <div className="overflow-hidden border border-dashed border-border bg-surface-1">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="text-sm uppercase tracking-[0.12em] text-heading">
          All Incidents
        </h2>
        <span className="text-[0.6875rem] text-body">{incidents.length} total</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2 text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
              <th className="px-4 py-3 font-normal">Endpoint</th>
              <th className="px-4 py-3 font-normal">Service</th>
              <th className="px-4 py-3 font-normal">Duration</th>
              <th className="px-4 py-3 font-normal">Severity</th>
              <th className="px-4 py-3 font-normal">Failures</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Started At</th>
            </tr>
          </thead>
          <tbody>
            {incidentsQuery.isLoading ? (
              <tr>
                <td className="px-4 py-6 text-body" colSpan={7}>
                  Loading incidents...
                </td>
              </tr>
            ) : null}

            {incidentsQuery.isError ? (
              <tr>
                <td className="px-4 py-6 text-red-300" colSpan={7}>
                  {incidentsQuery.error?.response?.data?.message ||
                    "Could not load incidents."}
                </td>
              </tr>
            ) : null}

            {!incidentsQuery.isLoading && !incidentsQuery.isError && incidents.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-body" colSpan={7}>
                  No incidents. All systems operational.
                </td>
              </tr>
            ) : null}

            {incidents.map((incident) => {
              const endpoint = getEndpointDetails(incident);
              const service = getServiceDetails(incident);
              const severity = getSeverity(Number(incident.failureCount) || 0);

              return (
                <tr
                  key={incident._id || incident.id}
                  className="border-b border-border/60 last:border-b-0"
                >
                  <td className="px-4 py-3 text-body">
                    <p className="font-medium text-heading">{endpoint.name}</p>
                    <p className="mt-1 font-mono text-[0.6875rem] text-body">{endpoint.path}</p>
                  </td>

                  <td className="px-4 py-3 text-body">
                    <p className="font-medium text-heading">{service.name}</p>
                    <p className="mt-1 text-[0.6875rem] uppercase tracking-[0.12em] text-body">{service.env}</p>
                  </td>

                  <td className="px-4 py-3 text-body">{formatDuration(incident.startedAt, incident.updatedAt, incident.status)}</td>

                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded border px-2 py-1 text-[0.6875rem] uppercase ${getSeverityBadgeClass(severity)}`}>
                      {severity}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-body">
                    <span className="font-semibold text-heading">{Number(incident.failureCount) || 0}</span>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded border px-2 py-1 text-[0.6875rem] uppercase ${getStatusBadgeClass(
                        incident.status
                      )}`}
                    >
                      {(incident.status || "unknown").charAt(0).toUpperCase() +
                        (incident.status || "unknown").slice(1)}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-body">{formatDateTime(incident.startedAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncidentTable;
