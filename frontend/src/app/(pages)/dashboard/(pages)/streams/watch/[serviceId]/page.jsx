"use client";

import Container from "@/components/dashboard/common/Container";
import SectionHeading from "@/components/dashboard/common/SectionHeading";
import DashboardButton from "@/components/ui/DashboardButton";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { CircleAlert, RefreshCw, Signal, WifiOff } from "lucide-react";
import { ingestAPI, serviceAPI } from "@/lib/api/api";
import { baseUrl } from "@/lib/api/client";

const Page = () => {
  const params = useParams();
  const serviceId = params.serviceId;
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const [events, setEvents] = useState([]);
  const [eventSourceKey, setEventSourceKey] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined" || !serviceId) {
      return undefined;
    }

    let source = null;

    const connectStream = async () => {
      try {
        // validate service access first
        await ingestAPI.createIngestSession({ serviceId });

        source = new EventSource(`${baseUrl}/ingest/sse/${serviceId}`, {
          withCredentials: true,
        });

        source.onopen = () => {
          setIsConnected(true);
          setConnectionError("");
        };

        source.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);

            const batch = Array.isArray(parsed) ? parsed : [parsed];

            setEvents((current) =>
              [
                {
                  id: crypto.randomUUID(),
                  receivedAt: new Date().toISOString(),
                  batch,
                },
                ...current,
              ].slice(0, 25),
            );
          } catch {
            setConnectionError("Received malformed stream payload.");
          }
        };

        source.onerror = () => {
          setIsConnected(false);

          setConnectionError(
            "Live stream disconnected. It will retry automatically.",
          );
        };
      } catch (error) {
        setIsConnected(false);

        setConnectionError(
          error?.response?.data?.message || "Unable to connect to live stream.",
        );
      }
    };

    connectStream();

    return () => {
      source?.close();
    };
  }, [serviceId, eventSourceKey]);

  const latestBatch = events[0]?.batch ?? [];
  const totalLogs = useMemo(
    () =>
      events.reduce((count, event) => count + (event.batch?.length ?? 0), 0),
    [events],
  );

  const rows = useMemo(
    () =>
      events.flatMap((event) =>
        (event.batch || []).map((log, index) => ({
          id: `${event.id}-${index}`,
          receivedAt: event.receivedAt,
          ...log,
        })),
      ),
    [events],
  );

  const formatTime = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  const formatTimestamp = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  const getLevelTone = (level) => {
    switch (level) {
      case "error":
        return "border-rose-500/30 bg-rose-500/10 text-rose-200";
      case "warn":
        return "border-amber-500/30 bg-amber-500/10 text-amber-200";
      case "debug":
        return "border-sky-500/30 bg-sky-500/10 text-sky-200";
      default:
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
    }
  };

  const handleReconnect = () => {
    setEvents([]);
    setConnectionError("");
    setEventSourceKey((key) => key + 1);
  };

  return (
    <Container>
      <SectionHeading
        title="Streams Watch"
        description="Live SSE feed from /ingest/sse rendered as a clear log table."
      >
        <DashboardButton variant="secondary" onClick={handleReconnect}>
          <RefreshCw size={14} />
          Reconnect
        </DashboardButton>
      </SectionHeading>

      <div className="mb-4 flex flex-wrap items-center gap-2 text-[0.6875rem] text-body">
        <span className="rounded border border-border bg-surface-1 px-2 py-1 uppercase tracking-[0.12em] text-white/55">
          Connection
        </span>
        <span className="inline-flex items-center gap-1 rounded border border-border bg-surface-1 px-2 py-1 text-heading">
          {isConnected ? (
            <Signal size={12} className="text-emerald-300" />
          ) : (
            <WifiOff size={12} className="text-rose-300" />
          )}
          {isConnected ? "Live" : "Disconnected"}
        </span>
        <span className="text-white/35">
          {events.length} batches · {totalLogs} logs
        </span>
      </div>

      {connectionError ? (
        <div className="mb-6 flex items-start gap-3 rounded border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-rose-100">
          <CircleAlert size={16} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-sm">{connectionError}</p>
            <p className="mt-1 text-xs text-rose-100/80">
              The browser will retry, or you can reconnect manually.
            </p>
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden border border-dashed border-border bg-surface-1">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-sm uppercase tracking-[0.12em] text-heading">
            Live Logs
          </h2>
          <span className="text-[0.6875rem] text-body">
            {rows.length} shown · {events.length} batches
          </span>
        </div>

        <div className="max-h-[68vh] overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2 text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                <th className="px-4 py-3 font-normal">Received</th>
                <th className="px-4 py-3 font-normal">Timestamp</th>
                <th className="px-4 py-3 font-normal">Level</th>
                <th className="px-4 py-3 font-normal">Source</th>
                <th className="px-4 py-3 font-normal">Message</th>
                <th className="px-4 py-3 font-normal">Endpoint</th>
                <th className="px-4 py-3 font-normal">Method</th>
                <th className="px-4 py-3 font-normal">Status</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-body" colSpan={8}>
                    Waiting for SSE events from the ingest endpoint.
                  </td>
                </tr>
              ) : null}

              {rows.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-border/60 last:border-b-0"
                >
                  <td className="px-4 py-3 text-body">
                    {formatTime(log.receivedAt)}
                  </td>
                  <td className="px-4 py-3 text-body">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded border px-2 py-1 text-[0.6875rem] uppercase tracking-[0.12em] ${getLevelTone(log.level)}`}
                    >
                      {log.level || "info"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-body">{log.source || "-"}</td>
                  <td className="px-4 py-3 text-heading">
                    <p
                      className="max-w-[28rem] truncate"
                      title={log.message || ""}
                    >
                      {log.message || "No message"}
                    </p>
                    {log.metadata && Object.keys(log.metadata).length > 0 ? (
                      <p className="mt-1 text-[0.6875rem] text-body">
                        Metadata attached
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-body">
                    <p className="max-w-56 truncate" title={log.endpoint || ""}>
                      {log.endpoint || "-"}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-body">{log.method || "-"}</td>
                  <td className="px-4 py-3 text-body">
                    {log.statusCode ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
};

export default Page;
