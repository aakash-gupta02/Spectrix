import DashboardButton from "@/components/ui/DashboardButton";
import RowActionsMenu from "@/components/common/RowActionsMenu";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "../page";

export default function StreamTable({
  streams,
  streamsQuery,
  serviceLookup,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-hidden border border-dashed border-border bg-surface-1">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="text-sm uppercase tracking-[0.12em] text-heading">
          All Streams
        </h2>
        <span className="text-[0.6875rem] text-body">{streams.length} total</span>
      </div>

      <div className="max-h-[60vh] overflow-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2 text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
              <th className="px-4 py-3 font-normal">Name</th>
              <th className="px-4 py-3 font-normal">Service</th>
              <th className="px-4 py-3 font-normal">Key Preview</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Created</th>
              <th className="px-4 py-3 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {streamsQuery.isLoading ? (
              <tr>
                <td className="px-4 py-6 text-body" colSpan={6}>
                  Loading streams...
                </td>
              </tr>
            ) : null}

            {streamsQuery.isError ? (
              <tr>
                <td className="px-4 py-6 text-red-300" colSpan={6}>
                  {streamsQuery.error?.response?.data?.message ||
                    "Could not load streams."}
                </td>
              </tr>
            ) : null}

            {!streamsQuery.isLoading && !streamsQuery.isError && streams.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-body" colSpan={6}>
                  No streams yet. Create your first stream above.
                </td>
              </tr>
            ) : null}

            {streams.map((stream) => {
              const streamId = stream?._id || stream?.id;
              const serviceId = stream?.serviceId?._id || stream?.serviceId?.id || stream?.serviceId;
              const service = serviceLookup?.[serviceId];

              return (
                <tr
                  key={streamId || `${stream.name}-${stream.keyPreview}`}
                  className="border-b border-border/60 last:border-b-0"
                >
                  <td className="px-4 py-3 text-heading">
                    <p>{stream.name || "-"}</p>
                    <p className="mt-1 text-xs text-body">{service?.environment || "Stream key"}</p>
                  </td>

                  <td className="px-4 py-3 text-body">
                    <p className="text-heading">{service?.name || serviceId || "-"}</p>
                    <p className="mt-1 truncate text-xs text-body" title={service?.baseUrl || ""}>
                      {service?.baseUrl || "No linked service details"}
                    </p>
                  </td>

                  <td className="px-4 py-3 font-mono text-xs text-body-strong">
                    {stream.keyPreview || "-"}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded border px-2 py-1 text-[0.6875rem] ${
                        stream.isActive
                          ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-300"
                          : "border-rose-500/35 bg-rose-500/10 text-rose-300"
                      }`}
                    >
                      {stream.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-body">{formatDate(stream.createdAt)}</td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <DashboardButton
                        type="button"
                        variant="secondary"
                        className="hover:border-primary/40 hover:bg-primary-soft hover:text-primary"
                        href={`/dashboard/streams/watch/${serviceId}`}
                      >
                        <Eye size={13} />
                        Watch
                      </DashboardButton>

                      <RowActionsMenu
                        actions={[
                          {
                            label: "Edit",
                            icon: <Pencil size={14} />,
                            variant: "default",
                            onClick: () => onEdit?.(stream),
                          },
                          {
                            label: "Delete",
                            icon: <Trash2 size={14} />,
                            variant: "danger",
                            onClick: () => onDelete?.(stream),
                          },
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}