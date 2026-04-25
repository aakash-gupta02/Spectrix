"use client";

import DashboardButton from "@/components/ui/DashboardButton";
import { alertChannelAPI } from "@/lib/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";
import { useDemoAction } from "@/contexts/AuthContext";

export default function DeleteAlertChannelModal({
  isOpen,
  channel,
  onClose,
  onDeleted,
}) {
  const queryClient = useQueryClient();
  const checkDemoAction = useDemoAction();

  const deleteAlertChannelMutation = useMutation({
    mutationFn: (id) => alertChannelAPI.deleteAlertChannel(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["alert-channels"] });
      onDeleted?.(data?.message || "Alert channel deleted successfully.");
      onClose();
    },
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape" && !deleteAlertChannelMutation.isPending) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [deleteAlertChannelMutation.isPending, isOpen, onClose]);

  const handleDelete = () => {
    if (!checkDemoAction("Deleting an alert channel")) {
      return;
    }

    const channelId = channel?._id || channel?.id;
    if (!channelId) {
      return;
    }

    deleteAlertChannelMutation.mutate(channelId);
  };

  if (!isOpen || !channel) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center bg-black/70 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-alert-channel-title"
      onClick={() => {
        if (!deleteAlertChannelMutation.isPending) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-md border border-dashed border-border bg-surface-1"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-rose-300" />
            <h2
              id="delete-alert-channel-title"
              className="text-sm uppercase tracking-[0.12em] text-heading"
            >
              Delete Alert Channel
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={deleteAlertChannelMutation.isPending}
            aria-label="Close delete alert channel modal"
            className="inline-flex items-center rounded border border-border p-2 text-body transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X size={14} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4 text-sm text-body">
          <p>
            This action will permanently remove
            <span className="mx-1 text-heading">
              {channel.type || "this alert channel"}
            </span>
            from your workspace.
          </p>
          <p className="break-all rounded border border-border/70 bg-surface-2 px-2 py-1 text-xs text-body-strong">
            {channel.url || "No URL"}
          </p>
          <p className="text-xs text-white/60">This action cannot be undone.</p>

          {deleteAlertChannelMutation.isError ? (
            <div className="border border-red-500/40 bg-red-500/5 px-3 py-2 text-sm text-red-300">
              {deleteAlertChannelMutation.error?.response?.data?.message ||
                "Could not delete alert channel. Please try again."}
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-4">
          <DashboardButton
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={deleteAlertChannelMutation.isPending}
          >
            Cancel
          </DashboardButton>
          <DashboardButton
            type="button"
            variant="primary"
            onClick={handleDelete}
            disabled={deleteAlertChannelMutation.isPending}
            className="border-rose-500/40 bg-rose-500/15 text-rose-200 hover:border-rose-500/60 hover:bg-rose-500/25 hover:text-rose-100"
          >
            {deleteAlertChannelMutation.isPending ? "Deleting..." : "Delete channel"}
          </DashboardButton>
        </div>
      </div>
    </div>
  );
}
