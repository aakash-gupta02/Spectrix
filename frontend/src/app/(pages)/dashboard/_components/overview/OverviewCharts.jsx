"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = {
  primary: "#c6f91f",
  success: "#22c55e",
  amber: "#fbbf24",
  rose: "#f43f5e",
  sky: "#38bdf8",
  muted: "#94a3b8",
  border: "rgba(255, 255, 255, 0.1)",
  grid: "rgba(255, 255, 255, 0.06)",
};

const UPTIME_COLORS = {
  "24h": COLORS.sky,
  "7d": COLORS.primary,
  "30d": COLORS.success,
};

function ChartTooltip({ active, payload, label, valueFormatter }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="border border-border bg-surface-2 px-3 py-2 text-xs shadow-lg">
      <p className="mb-1.5 text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
        {label}
      </p>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div
            key={entry.dataKey}
            className="flex items-center justify-between gap-4"
          >
            <span className="inline-flex items-center gap-1.5 text-body">
              <span
                className="inline-block h-2 w-2"
                style={{ backgroundColor: entry.color || entry.fill }}
              />
              {entry.name}
            </span>
            <span className="font-mono text-heading">
              {valueFormatter
                ? valueFormatter(entry.value, entry.dataKey)
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OverviewUptimeChart({ uptime24h = 0, uptime7d = 0, uptime30d = 0 }) {
  const data = useMemo(
    () => [
      { window: "24h", uptime: Number(uptime24h) || 0 },
      { window: "7d", uptime: Number(uptime7d) || 0 },
      { window: "30d", uptime: Number(uptime30d) || 0 },
    ],
    [uptime24h, uptime7d, uptime30d],
  );

  return (
    <div className="border border-border bg-surface-2 p-4">
      <div className="mb-3">
        <p className="text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
          Uptime by window
        </p>
        <p className="mt-1 text-xs text-body">24h · 7d · 30d comparison</p>
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="window"
              tick={{ fill: COLORS.muted, fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: COLORS.border }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: COLORS.muted, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={32}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
              content={
                <ChartTooltip
                  valueFormatter={(value) =>
                    `${new Intl.NumberFormat("en-US", {
                      maximumFractionDigits: 2,
                    }).format(Number(value) || 0)}%`
                  }
                />
              }
            />
            <Bar dataKey="uptime" name="Uptime" radius={0} maxBarSize={48} isAnimationActive={false}>
              {data.map((entry) => (
                <Cell
                  key={entry.window}
                  fill={UPTIME_COLORS[entry.window] || COLORS.primary}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function OverviewErrorsChart({ items = [] }) {
  const data = useMemo(
    () =>
      items.slice(0, 6).map((item) => ({
        name: item?.endpointName || item?.path || "Endpoint",
        shortName: truncateLabel(item?.endpointName || item?.path || "Endpoint", 16),
        method: String(item?.method || "").toUpperCase(),
        count: Number(item?.count || 0),
      })),
    [items],
  );

  if (!data.length) {
    return (
      <div className="flex h-52 items-center justify-center border border-dashed border-border bg-surface-2 px-4 text-xs text-body">
        No error data is available for the selected scope.
      </div>
    );
  }

  return (
    <div className="border border-border bg-surface-2 p-4">
      <div className="mb-3">
        <p className="text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
          Errors by endpoint
        </p>
        <p className="mt-1 text-xs text-body">Top failing endpoints · last 24h</p>
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 12, left: 4, bottom: 0 }}
          >
            <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fill: COLORS.muted, fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: COLORS.border }}
            />
            <YAxis
              type="category"
              dataKey="shortName"
              width={88}
              tick={{ fill: COLORS.muted, fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
              content={
                <ChartTooltip
                  valueFormatter={(value) =>
                    new Intl.NumberFormat("en-US").format(Number(value) || 0)
                  }
                />
              }
            />
            <Bar
              dataKey="count"
              name="Errors"
              fill={COLORS.rose}
              radius={0}
              maxBarSize={18}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function truncateLabel(value, max = 16) {
  const text = String(value || "");
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}
