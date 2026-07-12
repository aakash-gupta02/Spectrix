import DashboardButton from "@/components/ui/DashboardButton";
import { ExternalLink } from "lucide-react";

export default function StatusPagePublicUrlCard({ publicUrl, serviceSummary = [] }) {
  if (!publicUrl) return null;

  return (
    <section className="border border-dashed border-border bg-surface-1">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="text-sm uppercase tracking-[0.12em] text-heading">
          Public URL
        </h2>
      </div>

      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <code className="break-all border border-border bg-surface-2 px-3 py-2 text-sm text-body">
          {publicUrl}
        </code>

        <DashboardButton href={publicUrl} variant="secondary">
          <ExternalLink size={14} />
          Open
        </DashboardButton>
      </div>

      {serviceSummary.length ? (
        <div className="border-t border-border px-5 py-3 text-[0.6875rem] text-body">
          Selected services: {serviceSummary.join(", ")}
        </div>
      ) : null}
    </section>
  );
}
