"use client";

import Container from "@/components/dashboard/common/Container";
import SectionHeading from "@/components/dashboard/common/SectionHeading";
import LocalServiceFilterDropdown from "@/components/dashboard/layout/LocalServiceFilterDropdown";
import DashboardButton from "@/components/ui/DashboardButton";
import useServiceFiltering from "@/hooks/useServiceFiltering";
import { endPointsAPI, logsAPI } from "@/lib/api/api";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";

const PAGE_SIZE = 10;

function formatDateTime(value) {
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
    second: "2-digit",
  }).format(date);
}

function getMethodBadgeClass(method) {
  switch ((method || "").toUpperCase()) {
    case "GET":
      return "border-sky-500/35 bg-sky-500/10 text-sky-300";
    case "POST":
      return "border-emerald-500/35 bg-emerald-500/10 text-emerald-300";
    case "PUT":
      return "border-amber-500/35 bg-amber-500/10 text-amber-300";
    case "PATCH":
      return "border-violet-500/35 bg-violet-500/10 text-violet-300";
    case "DELETE":
      return "border-rose-500/35 bg-rose-500/10 text-rose-300";
    default:
      return "border-slate-500/35 bg-slate-500/10 text-slate-300";
  }
}

function getResultBadgeClass(result) {
  switch ((result || "").toLowerCase()) {
    case "success":
      return "border-emerald-500/35 bg-emerald-500/10 text-emerald-300";
    case "failure":
    case "failed":
    case "error":
      return "border-rose-500/35 bg-rose-500/10 text-rose-300";
    default:
      return "border-slate-500/35 bg-slate-500/10 text-slate-300";
  }
}

function getStatusCodeBadgeClass(statusCode) {
  const code = Number(statusCode);

  if (!Number.isInteger(code)) {
    return "border-slate-500/35 bg-slate-500/10 text-slate-300";
  }

  if (code >= 200 && code < 300) {
    return "border-emerald-500/35 bg-emerald-500/10 text-emerald-300";
  }

  if (code >= 300 && code < 400) {
    return "border-sky-500/35 bg-sky-500/10 text-sky-300";
  }

  if (code >= 400 && code < 500) {
    return "border-amber-500/35 bg-amber-500/10 text-amber-300";
  }

  if (code >= 500) {
    return "border-rose-500/35 bg-rose-500/10 text-rose-300";
  }

  return "border-slate-500/35 bg-slate-500/10 text-slate-300";
}

const Page = () => {
  const [page, setPage] = useState(1);
  const [selectedEndpointId, setSelectedEndpointId] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [statusCodeFilter, setStatusCodeFilter] = useState("");

  const { localServiceId, activeServiceFilter, setLocalFilter } =
    useServiceFiltering();

  const endpointQuery = useQuery({
    queryKey: ["endpoint-options"],
    queryFn: () => endPointsAPI.getEndPoints(),
  });

  const endpoints = useMemo(
    () => endpointQuery.data?.endpoints?.endpoints || [],
    [endpointQuery.data],
  );

  const logQuery = useQuery({
    queryKey: [
      "logs",
      { page, limit: PAGE_SIZE, serviceId: activeServiceFilter },
    ],
    queryFn: async () => {
      return logsAPI.getLogs({
        serviceId: activeServiceFilter,
        limit: PAGE_SIZE,
        page,
      });
    },
  });

  const logs = useMemo(() => logQuery.data?.logs?.logs || [], [logQuery.data]);
  const logsPagination = logQuery.data?.logs?.pagination || {};

  const filteredLogs = useMemo(() => {
    const normalizedStatusCode = statusCodeFilter.trim();

    return logs.filter((log) => {
      const result = String(log?.result || "").toLowerCase();
      const method = String(
        log?.endpointId?.method || log?.method || "",
      ).toUpperCase();
      const statusCode = String(log?.statusCode ?? "");

      const matchesResult = resultFilter === "all" || result === resultFilter;
      const matchesMethod = methodFilter === "all" || method === methodFilter;
      const matchesStatusCode =
        !normalizedStatusCode || statusCode.includes(normalizedStatusCode);

      return matchesResult && matchesMethod && matchesStatusCode;
    });
  }, [logs, methodFilter, resultFilter, statusCodeFilter]);

  const hasClientFilters =
    resultFilter !== "all" ||
    methodFilter !== "all" ||
    Boolean(statusCodeFilter.trim());

  const totalPages = Number(logsPagination.totalPages) || 1;
  const totalLogs = Number(logsPagination.total) || 0;
  const hasPreviousPage = Boolean(logsPagination.hasPreviousPage) || page > 1;
  const hasNextPage = Boolean(logsPagination.hasNextPage) || page < totalPages;

  const handleResetClientFilters = () => {
    setResultFilter("all");
    setMethodFilter("all");
    setStatusCodeFilter("");
  };

  return (
    <Container>
      <SectionHeading
        title="Logs"
        description="Inspect endpoint checks with filtering and pagination."
      >
        <LocalServiceFilterDropdown
          value={localServiceId}
          onChange={setLocalFilter}
          allOptionLabel="All Services"
        />
      </SectionHeading>

      {/* Filters */}
      <div className="mb-6 border border-dashed border-border bg-surface-1">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-sm uppercase tracking-[0.12em] text-heading">
            Filters
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-2 p-4 md:grid-cols-2 lg:grid-cols-4">
          <select
            value={selectedEndpointId}
            onChange={(event) => {
              setSelectedEndpointId(event.target.value);
              setPage(1);
            }}
            className="w-full rounded border border-border bg-surface-2 px-3 py-2 text-xs text-heading outline-none transition focus:border-primary"
          >
            <option value="all">All Endpoints</option>
            {endpoints.map((endpoint) => {
              const endpointId = endpoint?._id || endpoint?.id;
              if (!endpointId) {
                return null;
              }

              return (
                <option key={endpointId} value={endpointId}>
                  {endpoint?.name || endpoint?.path || endpointId}
                </option>
              );
            })}
          </select>

          <select
            value={resultFilter}
            onChange={(event) => setResultFilter(event.target.value)}
            className="w-full rounded border border-border bg-surface-2 px-3 py-2 text-xs text-heading outline-none transition focus:border-primary"
          >
            <option value="all">All Results</option>
            <option value="success">Success</option>
            <option value="failure">Failure</option>
            <option value="error">Error</option>
          </select>

          <select
            value={methodFilter}
            onChange={(event) => setMethodFilter(event.target.value)}
            className="w-full rounded border border-border bg-surface-2 px-3 py-2 text-xs text-heading outline-none transition focus:border-primary"
          >
            <option value="all">All Methods</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>

          <div className="flex items-center gap-2">
            <input
              value={statusCodeFilter}
              onChange={(event) => setStatusCodeFilter(event.target.value)}
              placeholder="Status code"
              className="w-full rounded border border-border bg-surface-2 px-3 py-2 text-xs text-heading outline-none transition focus:border-primary"
            />
            <DashboardButton
              type="button"
              variant="secondary"
              onClick={handleResetClientFilters}
              disabled={!hasClientFilters}
            >
              Reset
            </DashboardButton>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-hidden border border-dashed border-border bg-surface-1">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-sm uppercase tracking-[0.12em] text-heading">
            Logs
          </h2>
          <span className="text-[0.6875rem] text-body">
            {filteredLogs.length} shown · {totalLogs} total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2 text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                <th className="px-4 py-3 font-normal">Checked At</th>
                <th className="px-4 py-3 font-normal">Endpoint</th>
                <th className="px-4 py-3 font-normal">Method</th>
                <th className="px-4 py-3 font-normal">Result</th>
                <th className="px-4 py-3 font-normal">Status Code</th>
                <th className="px-4 py-3 font-normal">Response Time</th>
              </tr>
            </thead>

            <tbody>
              {logQuery.isLoading ? (
                <tr>
                  <td className="px-4 py-6 text-body" colSpan={6}>
                    Loading logs...
                  </td>
                </tr>
              ) : null}

              {logQuery.isError ? (
                <tr>
                  <td className="px-4 py-6 text-red-300" colSpan={6}>
                    {logQuery.error?.response?.data?.message ||
                      "Could not load logs."}
                  </td>
                </tr>
              ) : null}

              {!logQuery.isLoading &&
              !logQuery.isError &&
              filteredLogs.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-body" colSpan={6}>
                    {hasClientFilters
                      ? "No logs match the selected filters on this page."
                      : "No logs available yet."}
                  </td>
                </tr>
              ) : null}

              {filteredLogs.map((log) => {
                const logId = log?._id || log?.id;
                const endpointName =
                  log?.endpointId?.name || "Unknown endpoint";
                const endpointPath = log?.endpointId?.path || "-";
                const method = log?.endpointId?.method || log?.method || "-";

                return (
                  <tr
                    key={logId || `${endpointName}-${log?.checkedAt}`}
                    className="border-b border-border/60 last:border-b-0"
                  >
                    <td className="px-4 py-3 text-body">
                      {formatDateTime(log?.checkedAt)}
                    </td>

                    <td className="px-4 py-3 text-body">
                      <p className="font-medium text-heading">{endpointName}</p>
                      <p className="mt-1 font-mono text-[0.6875rem] text-body">
                        {endpointPath}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded border px-2 py-1 text-[0.6875rem] font-mono uppercase ${getMethodBadgeClass(method)}`}
                      >
                        {method}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded border px-2 py-1 text-[0.6875rem] uppercase ${getResultBadgeClass(log?.result)}`}
                      >
                        {String(log?.result || "unknown")}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded border px-2 py-1 text-[0.6875rem] font-mono ${getStatusCodeBadgeClass(log?.statusCode)}`}
                      >
                        {log?.statusCode ?? "-"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-body">
                      {Number.isFinite(Number(log?.responseTime))
                        ? `${Number(log.responseTime)} ms`
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3">
          <p className="text-xs text-body">
            Page {page} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <DashboardButton
              type="button"
              variant="secondary"
              disabled={!hasPreviousPage || logQuery.isFetching}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </DashboardButton>

            <DashboardButton
              type="button"
              variant="secondary"
              disabled={!hasNextPage || logQuery.isFetching}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Next
            </DashboardButton>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Page;
