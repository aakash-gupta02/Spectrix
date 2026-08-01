"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = {
  primary: "#c6f91f",
  success: "#22c55e",
  sky: "#38bdf8",
  muted: "#94a3b8",
  border: "rgba(255, 255, 255, 0.1)",
  grid: "rgba(255, 255, 255, 0.06)",
};

const UTC_DATE = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  timeZone: "UTC",
});

const UTC_TIME = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

const UTC_FULL = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

function parseBucketDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatAxisParts(value) {
  const date = parseBucketDate(value);
  if (!date) return { date: "-", time: "" };

  return {
    date: UTC_DATE.format(date),
    time: UTC_TIME.format(date),
  };
}

function formatTooltipLabel(value) {
  const date = parseBucketDate(value);
  if (!date) return "-";
  return `${UTC_FULL.format(date)} UTC`;
}

function ChartTooltip({ active, payload, label, valueFormatter }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="border border-border bg-surface-2 px-3 py-2 text-xs shadow-lg">
      <p className="mb-1.5 text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
        {formatTooltipLabel(label)}
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
                style={{ backgroundColor: entry.color }}
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

function AxisTick({ x, y, payload }) {
  const { date, time } = formatAxisParts(payload.value);

  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" fill={COLORS.muted} fontSize={10}>
        <tspan x={0} dy="12">
          {date}
        </tspan>
        <tspan x={0} dy="12">
          {time}
        </tspan>
      </text>
    </g>
  );
}

function EmptyChart({ message }) {
  return (
    <div className="flex h-56 items-center justify-center border border-dashed border-border bg-surface-2 px-4 text-sm text-body">
      {message}
    </div>
  );
}

export default function EndpointTimeSeriesCharts({ series = [] }) {
  const chartData = useMemo(
    () =>
      series.map((item) => ({
        bucketStart: item.bucketStart || item.time,
        total: Number(item.total || 0),
        success: Number(item.success || 0),
        avgLatency: Number(item.avgLatency || 0),
      })),
    [series],
  );

  if (!chartData.length) {
    return (
      <EmptyChart message="No time series data available for this window." />
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="border border-border bg-surface-2 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
              Traffic
            </h3>
            <p className="mt-1 text-xs text-body">Requests vs successful checks</p>
          </div>
          <div className="flex items-center gap-3 text-[0.625rem] text-body">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 bg-sky-400" />
              Total
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 bg-emerald-500" />
              Success
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 18 }}>
              <defs>
                <linearGradient id="trafficTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.sky} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={COLORS.sky} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="trafficSuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.success} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={COLORS.success} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="bucketStart"
                tick={<AxisTick />}
                tickLine={false}
                axisLine={{ stroke: COLORS.border }}
                minTickGap={40}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: COLORS.muted, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={36}
                allowDecimals={false}
              />
              <Tooltip
                content={
                  <ChartTooltip
                    valueFormatter={(value) =>
                      new Intl.NumberFormat("en-US").format(Number(value) || 0)
                    }
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="total"
                name="Total"
                stroke={COLORS.sky}
                fill="url(#trafficTotal)"
                strokeWidth={1.75}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="success"
                name="Success"
                stroke={COLORS.success}
                fill="url(#trafficSuccess)"
                strokeWidth={1.75}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="border border-border bg-surface-2 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
              Latency
            </h3>
            <p className="mt-1 text-xs text-body">Average response time (ms)</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[0.625rem] text-body">
            <span className="h-2 w-2 bg-primary" />
            Avg latency
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 18 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="bucketStart"
                tick={<AxisTick />}
                tickLine={false}
                axisLine={{ stroke: COLORS.border }}
                minTickGap={40}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: COLORS.muted, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={40}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                content={
                  <ChartTooltip
                    valueFormatter={(value) =>
                      `${new Intl.NumberFormat("en-US").format(Number(value) || 0)} ms`
                    }
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="avgLatency"
                name="Avg latency"
                stroke={COLORS.primary}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, fill: COLORS.primary }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
