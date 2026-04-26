"use client";

import Container from "@/components/dashboard/common/Container";
import SectionHeading from "@/components/dashboard/common/SectionHeading";
import LocalServiceFilterDropdown from "@/components/dashboard/layout/LocalServiceFilterDropdown";
import DashboardButton from "@/components/ui/DashboardButton";
import { useService } from "@/contexts/ServiceContext";
import useServiceFiltering from "@/hooks/useServiceFiltering";
import { overviewAPI } from "@/lib/api/api";
import { useQuery } from "@tanstack/react-query";
import { Activity, AlertTriangle, Clock3, RefreshCw, Server } from "lucide-react";
import { useMemo } from "react";
import OverviewMetricCard from "./_components/overview/OverviewMetricCard";
import OverviewSectionCard from "./_components/overview/OverviewSectionCard";
import OverviewTopErrors from "./_components/overview/OverviewTopErrors";

const formatNumber = (value, minimumFractionDigits = 0, maximumFractionDigits = 2) => {
    if (value === null || value === undefined || value === "" || Number.isNaN(Number(value))) {
        return "-";
    }

    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits,
        maximumFractionDigits,
    }).format(Number(value));
};

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
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
    }).format(date);
};

export default function DashboardPage() {
    const { selectedService } = useService();
    const { localServiceId, activeServiceFilter, setLocalFilter } = useServiceFiltering();

    const overviewQuery = useQuery({
        queryKey: ["overview-metrics", activeServiceFilter || "all"],
        queryFn: () => overviewAPI.getOverviewMetrics({ serviceId: activeServiceFilter }),
    });

    const metrics = overviewQuery.data?.metrics ?? overviewQuery.data?.overview;
    const errorItems = useMemo(() => {
        if (metrics?.errorsByApi24h?.items) {
            return metrics.errorsByApi24h.items;
        }

        if (metrics?.endpointBreakdown) {
            return metrics.endpointBreakdown.map((item) => ({
                endpointId: item.endpointId,
                endpointName: item.endpointName,
                method: item.method,
                path: item.path,
                count: item.failureChecks,
            }));
        }

        return [];
    }, [metrics]);

    const generatedAt = formatDateTime(metrics?.generatedAt ?? metrics?.timeWindow?.to);
    const totalApis = metrics?.totalApis?.value ?? 0;
    const newThisWeek = metrics?.totalApis?.newThisWeek ?? 0;
    const uptimeValue = metrics?.uptime?.value ?? 0;
    const uptime24h = metrics?.uptime?.last24h ?? uptimeValue;
    const uptime30d = metrics?.uptime?.last30d ?? uptimeValue;
    const avgResponseTime = metrics?.avgResponseTime?.valueMs ?? metrics?.summary?.avgResponseTime ?? 0;
    const deltaResponseTime = metrics?.avgResponseTime?.deltaMsVsLastWeek ?? 0;
    const openIncidents = metrics?.incidents?.open ?? 0;
    const errorRate = metrics?.errorRate?.value ?? metrics?.summary?.failureRate ?? 0;

    const selectedScopeLabel = activeServiceFilter
        ? selectedService?.name || "Filtered service"
        : "All services";

    return (
        <Container>
            <SectionHeading
                title="Overview"
                description="Real-time uptime, response time, incident pressure, and endpoint error concentration."
            >
                <LocalServiceFilterDropdown
                    value={localServiceId}
                    onChange={setLocalFilter}
                    allOptionLabel="All Services"
                />

                <DashboardButton
                    variant="secondary"
                    onClick={() => overviewQuery.refetch()}
                    disabled={overviewQuery.isFetching}
                >
                    <RefreshCw size={14} className={overviewQuery.isFetching ? "animate-spin" : ""} />
                    Refresh
                </DashboardButton>
            </SectionHeading>

            <div className="mb-4 flex flex-wrap items-center gap-2 text-[0.6875rem] text-body">
                <span className="rounded border border-border bg-surface-1 px-2 py-1 uppercase tracking-[0.12em] text-white/55">
                    Scope
                </span>
                <span className="rounded border border-border bg-surface-1 px-2 py-1 text-heading">
                    {selectedScopeLabel}
                </span>
                <span className="text-white/35">Updated {generatedAt}</span>
            </div>

            {overviewQuery.isLoading ? (
                <div className="rounded-lg border border-dashed border-border bg-surface-1 px-5 py-6 text-body">
                    Loading overview metrics...
                </div>
            ) : null}

            {overviewQuery.isError ? (
                <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-rose-200">
                    Could not load overview metrics.
                </div>
            ) : null}

            {metrics ? (
                <>
                    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <OverviewMetricCard
                            title="Total APIs"
                            value={formatNumber(totalApis, 0, 0)}
                            meta={`${formatNumber(newThisWeek, 0, 0)} new this week`}
                            icon={Server}
                        />

                        <OverviewMetricCard
                            title="Uptime"
                            value={`${formatNumber(uptimeValue, 0, 2)}%`}
                            meta={`7d window · 24h ${formatNumber(uptime24h, 0, 2)}% · 30d ${formatNumber(uptime30d, 0, 2)}%`}
                            icon={Activity}
                        />

                        <OverviewMetricCard
                            title="Avg Response Time"
                            value={`${formatNumber(avgResponseTime, 0, 2)} ms`}
                            meta={`${deltaResponseTime >= 0 ? "+" : ""}${formatNumber(deltaResponseTime, 0, 2)} ms vs last week`}
                            icon={Clock3}
                            tone={deltaResponseTime <= 0 ? "success" : "warning"}
                        />

                        <OverviewMetricCard
                            title="Incidents / Error Rate"
                            value={`${formatNumber(openIncidents, 0, 0)} open`}
                            meta={`${formatNumber(errorRate, 0, 2)}% error rate over 24h`}
                            icon={AlertTriangle}
                            tone={openIncidents === 0 ? "success" : "danger"}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        <OverviewSectionCard
                            title="Service Health"
                            description="A compact view of the current reliability posture for the selected scope."
                            className="lg:col-span-2"
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded border border-border bg-surface-2 p-4">
                                    <p className="text-[0.6875rem] uppercase tracking-[0.12em] text-muted">Windowed uptime</p>
                                    <div className="mt-2 text-3xl font-light tracking-tight text-heading">{formatNumber(uptimeValue, 0, 2)}%</div>
                                    <p className="mt-2 text-[0.6875rem] text-body">Last 7 days · updated {generatedAt}</p>

                                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
                                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-primary" style={{ width: `${Math.max(0, Math.min(100, uptimeValue))}%` }} />
                                    </div>
                                </div>

                                <div className="rounded border border-border bg-surface-2 p-4">
                                    <p className="text-[0.6875rem] uppercase tracking-[0.12em] text-muted">Reliability snapshot</p>
                                    <div className="mt-3 space-y-3 text-xs text-body">
                                        <div className="flex items-center justify-between gap-3">
                                            <span>Open incidents</span>
                                            <span className="text-heading">{formatNumber(openIncidents, 0, 0)}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span>24h error rate</span>
                                            <span className="text-heading">{formatNumber(errorRate, 0, 2)}%</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span>Response time delta</span>
                                            <span className={deltaResponseTime <= 0 ? "text-emerald-300" : "text-amber-300"}>
                                                {deltaResponseTime >= 0 ? "+" : ""}{formatNumber(deltaResponseTime, 0, 2)} ms
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </OverviewSectionCard>

                        <OverviewSectionCard
                            title="Top Error Endpoints"
                            description="The endpoints generating the most errors over the last 24 hours."
                        >
                            <OverviewTopErrors items={errorItems} />
                        </OverviewSectionCard>
                    </div>
                </>
            ) : null}
        </Container>
    );
}