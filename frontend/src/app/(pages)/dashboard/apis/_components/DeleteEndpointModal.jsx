"use client";

import DashboardButton from "@/components/ui/DashboardButton";
import { endPointsAPI } from "@/lib/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";

export default function DeleteEndpointModal({ isOpen, endpoint, onClose, onDeleted }) {
  const queryClient = useQueryClient();

  const deleteEndpointMutation = useMutation({
    mutationFn: (id) => endPointsAPI.deleteEndpoint(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apis"] });
      onDeleted?.("API endpoint deleted successfully.");
      onClose();
    },
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape" && !deleteEndpointMutation.isPending) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [deleteEndpointMutation.isPending, isOpen, onClose]);

  const handleDelete = () => {
    const endpointId = endpoint?._id || endpoint?.id;
    if (!endpointId) {
      return;
    }

    deleteEndpointMutation.mutate(endpointId);
  };

  if (!isOpen || !endpoint) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center bg-black/70 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-endpoint-title"
      onClick={() => {
        if (!deleteEndpointMutation.isPending) {
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
              id="delete-endpoint-title"
              className="text-sm uppercase tracking-[0.12em] text-heading"
            >
              Delete API Endpoint
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={deleteEndpointMutation.isPending}
            aria-label="Close delete API endpoint modal"
            className="inline-flex items-center rounded border border-border p-2 text-body transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X size={14} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4 text-sm text-body">
          <p>
            This action will permanently remove
            <span className="mx-1 text-heading">{endpoint.name || "this API endpoint"}</span>
            from your workspace.
          </p>
          <p className="text-xs text-white/60">This action cannot be undone.</p>

          {deleteEndpointMutation.isError ? (
            <div className="border border-red-500/40 bg-red-500/5 px-3 py-2 text-sm text-red-300">
              {deleteEndpointMutation.error?.response?.data?.message ||
                "Could not delete API endpoint. Please try again."}
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-4">
          <DashboardButton
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={deleteEndpointMutation.isPending}
          >
            Cancel
          </DashboardButton>
          <DashboardButton
            type="button"
            variant="primary"
            onClick={handleDelete}
            disabled={deleteEndpointMutation.isPending}
            className="border-rose-500/40 bg-rose-500/15 text-rose-200 hover:border-rose-500/60 hover:bg-rose-500/25 hover:text-rose-100"
          >
            {deleteEndpointMutation.isPending ? "Deleting..." : "Delete API"}
          </DashboardButton>
        </div>
      </div>
    </div>
  );
}
