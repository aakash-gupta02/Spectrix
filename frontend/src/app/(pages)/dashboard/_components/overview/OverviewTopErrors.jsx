const methodToneClasses = {
    GET: "border-sky-500/35 bg-sky-500/10 text-sky-300",
    POST: "border-emerald-500/35 bg-emerald-500/10 text-emerald-300",
    PUT: "border-amber-500/35 bg-amber-500/10 text-amber-300",
    PATCH: "border-violet-500/35 bg-violet-500/10 text-violet-300",
    DELETE: "border-rose-500/35 bg-rose-500/10 text-rose-300",
};

function formatCount(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return "-";
    }

    return new Intl.NumberFormat("en-US").format(Number(value));
}

export default function OverviewTopErrors({ items = [] }) {
    if (!items.length) {
        return <div className="rounded border border-border bg-surface-2 px-3 py-4 text-xs text-body">No error data is available for the selected scope.</div>;
    }

    return (
        <div className="space-y-3">
            {items.map((item) => {
                const key = item?.endpointId || `${item?.method || "method"}-${item?.path || "path"}`;
                const method = String(item?.method || "").toUpperCase();

                return (
                    <div key={key} className="rounded border border-border bg-surface-2 p-3">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={`inline-flex rounded px-2 py-0.5 text-[0.625rem] uppercase tracking-[0.12em] ${methodToneClasses[method] || "border-border bg-white/5 text-body"}`}>
                                        {method || "API"}
                                    </span>
                                    <span className="truncate text-xs text-heading">{item?.endpointName || "Unnamed endpoint"}</span>
                                </div>
                                <p className="mt-2 truncate text-[0.6875rem] text-body">{item?.path || "-"}</p>
                            </div>

                            <div className="shrink-0 text-right">
                                <p className="text-lg font-light tracking-tight text-heading">{formatCount(item?.count)}</p>
                                <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted">errors</p>
                            </div>
                        </div>

                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-300"
                                style={{ width: `${Math.max(8, Math.min(100, Number(item?.count || 0) || 0))}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}