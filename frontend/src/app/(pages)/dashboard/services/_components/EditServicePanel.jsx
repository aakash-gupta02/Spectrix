"use client";

import DashboardButton from "@/components/ui/DashboardButton";
import { serviceAPI } from "@/lib/api/api";
import { updateServiceSchema } from "@/validation/service.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

const initialFormState = {
  name: "",
  description: "",
  baseUrl: "",
  environment: "development",
  active: true,
};

function toFormState(service) {
  return {
    name: service?.name || "",
    description: service?.description || "",
    baseUrl: service?.baseUrl || "",
    environment: service?.environment || "development",
    active: Boolean(service?.active),
  };
}

export default function EditServicePanel({
  isOpen,
  service,
  onClose,
  onUpdated,
}) {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");
  const nameInputRef = useRef(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: initialFormState,
    resolver: zodResolver(updateServiceSchema),
  });

  const updateServiceMutation = useMutation({
    mutationFn: ({ id, payload }) => serviceAPI.updateService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setErrorMessage("");
      onUpdated?.("Service updated successfully.");
      onClose();
    },
    onError: (error) => {
      setErrorMessage(
        error?.response?.data?.message ||
          "Could not update service. Please review your inputs.",
      );
    },
  });

  useEffect(() => {
    if (!isOpen || !service) return;

    reset(toFormState(service));

    const timer = setTimeout(() => {
      setErrorMessage("");
      nameInputRef.current?.focus();
    }, 0);

    return () => clearTimeout(timer);
  }, [isOpen, service, reset]);

  const onSubmit = (data) => {
    setErrorMessage("");

    const serviceId = service?._id || service?.id;
    if (!serviceId) {
      setErrorMessage("Unable to update this service. Missing service ID.");
      return;
    }

    updateServiceMutation.mutate({
      id: serviceId,
      payload: {
        ...data,
        description: data.description?.trim() || undefined,
      },
    });
  };

  if (!isOpen || !service) {
    return null;
  }

  return (
    <section
      className="mb-6 border border-dashed border-border bg-surface-1"
      aria-labelledby="edit-service-panel-title"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2
            id="edit-service-panel-title"
            className="text-sm uppercase tracking-[0.12em] text-heading"
          >
            Edit Service
          </h2>
          <p className="mt-1 text-[0.6875rem] text-body">
            Update service details and save changes.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close edit service panel"
          className="inline-flex items-center rounded border border-border p-2 text-body transition-colors hover:bg-white/5"
        >
          <X size={14} />
        </button>
      </div>

      <form
        className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-[0.12em] text-muted">
            Service Name
          </label>
          <input
            ref={nameInputRef}
            {...register("name")}
            maxLength={50}
            placeholder="Payments API"
            className="w-full rounded border border-border bg-surface-2 px-3 py-2 text-sm text-heading outline-none transition focus:border-primary"
          />
          {errors.name && (
            <p className="text-sm text-red-300">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-[0.12em] text-muted">
            Base URL
          </label>
          <input
            type="url"
            {...register("baseUrl")}
            placeholder="https://api.example.com"
            className="w-full rounded border border-border bg-surface-2 px-3 py-2 text-sm text-heading outline-none transition focus:border-primary"
          />
          {errors.baseUrl && (
            <p className="text-sm text-red-300">
              {errors.baseUrl.message}
            </p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-xs uppercase tracking-[0.12em] text-muted">
            Description (optional)
          </label>
          <input
            {...register("description")}
            maxLength={100}
            placeholder="Tracks checkout and order processing services"
            className="w-full rounded border border-border bg-surface-2 px-3 py-2 text-sm text-heading outline-none transition focus:border-primary"
          />
          {errors.description && (
            <p className="text-sm text-red-300">
              {errors.description.message}
            </p>
          )}

        </div>

        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-[0.12em] text-muted">
            Environment
          </label>
          <select
            {...register("environment")}
            className="w-full rounded border border-border bg-surface-2 px-3 py-2 text-sm text-heading outline-none transition focus:border-primary"
          >
            <option value="development">Development</option>
            <option value="staging">Staging</option>
            <option value="production">Production</option>
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-body">
            <input
              type="checkbox"
              {...register("active")}
              className="h-4 w-4 accent-primary"
            />
            Active service
          </label>
        </div>

        {errorMessage ? (
          <div className="md:col-span-2 border border-red-500/40 bg-red-500/5 px-3 py-2 text-sm text-red-300">
            {errorMessage}
          </div>
        ) : null}

        <div className="md:col-span-2 flex items-center justify-end gap-3">
          <DashboardButton
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={updateServiceMutation.isPending}
          >
            Cancel
          </DashboardButton>
          <DashboardButton
            type="submit"
            variant="primary"
            disabled={updateServiceMutation.isPending}
          >
            {updateServiceMutation.isPending ? "Saving..." : "Save changes"}
          </DashboardButton>
        </div>
      </form>
    </section>
  );
}
