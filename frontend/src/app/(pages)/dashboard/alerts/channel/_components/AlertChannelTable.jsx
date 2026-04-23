"use client";

import RowActionsMenu from "@/components/common/RowActionsMenu";
import { Trash2 } from "lucide-react";
import { formatDate } from "../page";
export default function AlertChannelTable({
  channels,
  alertChannelQuery,
  onDelete,
}) {
  return (
    <div className="overflow-hidden border border-dashed border-border bg-surface-1">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="text-sm uppercase tracking-[0.12em] text-heading">
          All Alert Channels
        </h2>
        <span className="text-[0.6875rem] text-body">{channels.length} total</span>
      </div>

      <div className="max-h-[60vh] overflow-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2 text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
              <th className="px-4 py-3 font-normal">Type</th>
              <th className="px-4 py-3 font-normal">URL</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Created</th>
              <th className="px-4 py-3 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {alertChannelQuery.isLoading ? (
              <tr>
                <td className="px-4 py-6 text-body" colSpan={5}>
                  Loading alert channels...
                </td>
              </tr>
            ) : null}

            {alertChannelQuery.isError ? (
              <tr>
                <td className="px-4 py-6 text-red-300" colSpan={5}>
                  {alertChannelQuery.error?.response?.data?.message ||
                    "Could not load alert channels."}
                </td>
              </tr>
            ) : null}

            {!alertChannelQuery.isLoading &&
            !alertChannelQuery.isError &&
            channels.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-body" colSpan={5}>
                  No alert channels yet. Create your first channel above.
                </td>
              </tr>
            ) : null}

            {channels.map((channel) => {
              const channelId = channel?._id || channel?.id;

              return (
                <tr
                  key={channelId || `${channel.type}-${channel.url}`}
                  className="border-b border-border/60 last:border-b-0"
                >
                  <td className="px-4 py-3 capitalize text-heading">{channel.type || "-"}</td>
                  <td className="max-w-[360px] truncate px-4 py-3 font-mono text-xs text-body-strong" title={channel.url || ""}>
                    {channel.url || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded border px-2 py-1 text-[0.6875rem] ${
                        channel.isActive
                          ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-300"
                          : "border-rose-500/35 bg-rose-500/10 text-rose-300"
                      }`}
                    >
                      {channel.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-body">{formatDate(channel.createdAt)}</td>
                  <td className="px-4 py-3">
                    <RowActionsMenu
                      actions={[
                        {
                          label: "Delete",
                          icon: <Trash2 size={14} />,
                          variant: "danger",
                          onClick: () => onDelete?.(channel),
                        },
                      ]}
                    />
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
