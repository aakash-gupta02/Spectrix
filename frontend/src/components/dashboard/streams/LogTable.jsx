import { useState } from "react";
import { Signal, Settings2 } from "lucide-react";
import DashboardButton from "@/components/ui/DashboardButton";

const AVAILABLE_COLUMNS = [
  { id: "timestamp", label: "Timestamp", defaultVisible: true },
  { id: "level", label: "Level", defaultVisible: true },
  { id: "method", label: "Method", defaultVisible: true },
  { id: "endpoint", label: "Endpoint", defaultVisible: true },
  { id: "statusCode", label: "Status", defaultVisible: true },
  { id: "duration", label: "Duration (ms)", defaultVisible: true },

  // False
  { id: "message", label: "Message", defaultVisible: false },
  { id: "source", label: "Source", defaultVisible: false },
  { id: "receivedAt", label: "Received", defaultVisible: false },
  { id: "ip", label: "IP Address", defaultVisible: false },
  { id: "userAgent", label: "User Agent", defaultVisible: false },
];

const getLevelTone = (level) => {
  switch (level?.toLowerCase()) {
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

const getMethodTone = (method) => {
  switch (method?.toUpperCase()) {
    case "GET":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
    case "POST":
      return "border-sky-500/30 bg-sky-500/10 text-sky-200";
    case "PUT":
    case "PATCH":
      return "border-amber-500/30 bg-amber-500/10 text-amber-200";
    case "DELETE":
      return "border-rose-500/30 bg-rose-500/10 text-rose-200";
    default:
      return "border-border bg-surface-2 text-body";
  }
};

const formatTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

const formatTimestamp = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

export default function LogTable({ rows = [], isConnected }) {
  const [visibleColumns, setVisibleColumns] = useState(() =>
    AVAILABLE_COLUMNS.reduce((acc, col) => {
      acc[col.id] = col.defaultVisible;
      return acc;
    }, {}),
  );

  const [showColumnDropdown, setShowColumnDropdown] = useState(false);

  const toggleColumn = (columnId) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  return (
    <div className="overflow-hidden border border-dashed border-border bg-surface-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border px-5 py-3 gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-sm uppercase tracking-[0.12em] text-heading">
            Live Logs
          </h2>
          <span className="text-[0.6875rem] text-body">
            {rows.length} logs shown
          </span>
        </div>

        <div className="relative">
          <DashboardButton
            variant="secondary"
            onClick={() => setShowColumnDropdown(!showColumnDropdown)}
            className="flex items-center gap-2"
          >
            <Settings2 size={14} />
            <span className="hidden sm:inline">Columns</span>
          </DashboardButton>

          {showColumnDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowColumnDropdown(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 rounded-md border border-border bg-surface-1 p-2 shadow-lg z-20">
                <div className="mb-2 px-2 text-xs font-semibold text-heading uppercase tracking-wider">
                  Show columns
                </div>
                <div className="flex max-h-60 flex-col gap-1 overflow-auto">
                  {AVAILABLE_COLUMNS.map((col) => (
                    <label
                      key={col.id}
                      className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-surface-2"
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns[col.id]}
                        onChange={() => toggleColumn(col.id)}
                        className="rounded border-border bg-surface-2 text-primary focus:ring-primary focus:ring-offset-surface-1"
                      />
                      <span className="text-sm text-body">{col.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="max-h-[68vh] overflow-auto">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-border bg-surface-2 text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
              {AVAILABLE_COLUMNS.map(
                (col) =>
                  visibleColumns[col.id] && (
                    <th key={col.id} className="px-4 py-3 font-normal">
                      {col.label}
                    </th>
                  ),
              )}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-12 text-center text-body"
                  colSpan={Object.values(visibleColumns).filter(Boolean).length}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Signal size={32} className="text-muted" />
                    <p>Waiting for logs...</p>
                    <p className="text-xs text-muted">
                      {isConnected
                        ? "Connected - waiting for data"
                        : "Not connected"}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-border/60 last:border-b-0 hover:bg-surface-2/30"
                >
                  {AVAILABLE_COLUMNS.map((col) => {
                    if (!visibleColumns[col.id]) return null;

                    switch (col.id) {
                      case "receivedAt":
                        return (
                          <td key={col.id} className="px-4 py-3 text-body text-xs">
                            {formatTime(log.receivedAt)}
                          </td>
                        );
                      case "timestamp":
                        return (
                          <td key={col.id} className="px-4 py-3 text-body text-xs">
                            {formatTimestamp(log.timestamp)}
                          </td>
                        );
                      case "level":
                        return (
                          <td key={col.id} className="px-4 py-3">
                            <span
                              className={`inline-flex rounded border px-2 py-1 text-[0.6875rem] uppercase tracking-[0.12em] ${getLevelTone(log.level)}`}
                            >
                              {log.level || "info"}
                            </span>
                          </td>
                        );
                      case "source":
                        return (
                          <td key={col.id} className="px-4 py-3 text-body text-xs">
                            {log.source || "-"}
                          </td>
                        );
                      case "message":
                        return (
                          <td key={col.id} className="px-4 py-3 text-heading">
                            <p
                              className="max-w-[28rem] truncate text-sm"
                              title={log.message || ""}
                            >
                              {log.message || "No message"}
                            </p>
                          </td>
                        );
                      case "endpoint":
                        return (
                          <td key={col.id} className="px-4 py-3 text-body text-xs">
                            <p
                              className="max-w-56 truncate"
                              title={log.endpoint || ""}
                            >
                              {log.endpoint || "-"}
                            </p>
                          </td>
                        );
                      case "method":
                        return (
                          <td key={col.id} className="px-4 py-3 text-body text-xs">
                            {log.method ? (
                              <span
                                className={`inline-flex rounded border px-2 py-1 text-[0.6875rem] uppercase tracking-[0.12em] ${getMethodTone(log.method)}`}
                              >
                                {log.method}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                        );
                      case "statusCode":
                        return (
                          <td key={col.id} className="px-4 py-3 text-body text-xs">
                            {log.statusCode ?? "-"}
                          </td>
                        );
                      case "duration":
                        return (
                          <td key={col.id} className="px-4 py-3 text-body text-xs">
                            {log.metadata?.duration ?? "-"}
                          </td>
                        );
                      case "ip":
                        return (
                          <td key={col.id} className="px-4 py-3 text-body text-xs">
                            {log.metadata?.ip || "-"}
                          </td>
                        );
                      case "userAgent":
                        return (
                          <td key={col.id} className="px-4 py-3 text-body text-xs">
                            <p
                              className="max-w-56 truncate"
                              title={log.metadata?.userAgent || ""}
                            >
                              {log.metadata?.userAgent || "-"}
                            </p>
                          </td>
                        );
                      default:
                        return null;
                    }
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
