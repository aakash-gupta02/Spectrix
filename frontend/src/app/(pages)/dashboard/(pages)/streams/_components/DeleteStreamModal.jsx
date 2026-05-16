"use client";

import DashboardButton from "@/components/ui/DashboardButton";
import { streamAPI } from "@/lib/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";
import { useDemoAction } from "@/contexts/AuthContext";

export default function DeleteStreamModal({
  isOpen,
  stream,
  serviceLookup,
  onClose,
  onDeleted,
}) {
  const queryClient = useQueryClient();
  const checkDemoAction = useDemoAction();

  const deleteStreamMutation = useMutation({
    mutationFn: (id) => streamAPI.deleteStream(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["streams"] });
      onDeleted?.(data?.message || "Stream deleted successfully.");
      onClose();
    },
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape" && !deleteStreamMutation.isPending) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [deleteStreamMutation.isPending, isOpen, onClose]);

  const handleDelete = () => {
    if (!checkDemoAction("Deleting a stream")) {
      return;
    }

    const streamId = stream?._id || stream?.id;
    if (!streamId) {
      return;
    }

    deleteStreamMutation.mutate(streamId);
  };

  if (!isOpen || !stream) {
    return null;
  }

  const serviceId = stream.serviceId?._id || stream.serviceId?.id || stream.serviceId;
  const serviceName = serviceLookup?.[serviceId]?.name || serviceId || "Unknown service";

  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center bg-black/70 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-stream-title"
      onClick={() => {
        if (!deleteStreamMutation.isPending) {
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
              id="delete-stream-title"
              className="text-sm uppercase tracking-[0.12em] text-heading"
            >
              Delete Stream
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={deleteStreamMutation.isPending}
            aria-label="Close delete stream modal"
            className="inline-flex items-center rounded border border-border p-2 text-body transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X size={14} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4 text-sm text-body">
          <p>
            This action will permanently remove
            <span className="mx-1 text-heading">{stream.name || "this stream"}</span>
            from your workspace.
          </p>
          <p className="rounded border border-border/70 bg-surface-2 px-2 py-1 text-xs text-body-strong">
            {serviceName}
          </p>
          <p className="break-all rounded border border-border/70 bg-surface-2 px-2 py-1 font-mono text-xs text-body-strong">
            {stream.keyPreview || "No key preview"}
          </p>
          <p className="text-xs text-white/60">This action cannot be undone.</p>

          {deleteStreamMutation.isError ? (
            <div className="border border-red-500/40 bg-red-500/5 px-3 py-2 text-sm text-red-300">
              {deleteStreamMutation.error?.response?.data?.message ||
                "Could not delete stream. Please try again."}
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-4">
          <DashboardButton
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={deleteStreamMutation.isPending}
          >
            Cancel
          </DashboardButton>
          <DashboardButton
            type="button"
            variant="primary"
            onClick={handleDelete}
            disabled={deleteStreamMutation.isPending}
            className="border-rose-500/40 bg-rose-500/15 text-rose-200 hover:border-rose-500/60 hover:bg-rose-500/25 hover:text-rose-100"
          >
            {deleteStreamMutation.isPending ? "Deleting..." : "Delete stream"}
          </DashboardButton>
        </div>
      </div>
    </div>
  );
}