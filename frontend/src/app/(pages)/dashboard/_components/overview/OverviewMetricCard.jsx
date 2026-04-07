import { TrendingDown, TrendingUp } from "lucide-react";

const toneClasses = {
    neutral: "border-border bg-surface-1",
    success: "border-emerald-500/20 bg-emerald-500/5",
    warning: "border-amber-500/20 bg-amber-500/5",
    danger: "border-rose-500/20 bg-rose-500/5",
};

export default function OverviewMetricCard({ title, value, meta, icon: Icon, tone = "neutral" }) {
    const accentClassName =
        tone === "success"
            ? "text-emerald-300"
            : tone === "warning"
                ? "text-amber-300"
                : tone === "danger"
                    ? "text-rose-300"
                    : "text-body";

    const TrendIcon = tone === "success" ? TrendingDown : TrendingUp;

    return (
        <article className={`rounded-lg border p-4 ${toneClasses[tone] || toneClasses.neutral}`}>
            <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-[0.6875rem] uppercase tracking-[0.15em] text-white/45">{title}</p>
                <div className="flex items-center gap-2 text-primary">
                    {Icon ? <Icon size={16} /> : null}
                    <TrendIcon size={13} className={accentClassName} />
                </div>
            </div>

            <p className="text-3xl font-light tracking-tight text-heading">{value}</p>
            <p className={`mt-1 text-[0.6875rem] ${accentClassName}`}>{meta}</p>
        </article>
    );
}