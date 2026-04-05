"use client";

import DashboardButton from "@/components/ui/DashboardButton";
import { serviceAPI } from "@/lib/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createServiceSchema } from "@/validation/service.validation";

const initialFormState = {
  name: "",
  description: "",
  baseUrl: "",
  environment: "development",
  active: true,
};

export default function CreateServiceModal({ isOpen, onClose, onCreated }) {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");
  const nameInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createServiceSchema),
    defaultValues: initialFormState,
  });

  // actual Service Create Logic/Mutation
  const createServiceMutation = useMutation({
    mutationFn: serviceAPI.createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      reset();
      setErrorMessage("");
      onCreated?.("Service created successfully.");
      onClose();
    },
    onError: (error) => {
      setErrorMessage(
        error?.response?.data?.message ||
          "Could not create service. Please check your input.",
      );
    },
  });

  const handleClose = useCallback(() => {
    setErrorMessage("");
    reset();
    onClose();
  }, [onClose, reset]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timer = setTimeout(() => {
      nameInputRef.current?.focus();
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [handleClose, isOpen, reset]);

  const onSubmit = (data) => {
    createServiceMutation.mutate({
      ...data,
      description: data.description?.trim() || undefined,
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <section
      className="mb-6 border border-dashed border-border bg-surface-1"
      aria-labelledby="create-service-panel-title"
    >
      {/* Form Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        {/* Header Text */}
        <div>
          <h2
            id="create-service-panel-title"
            className="text-sm uppercase tracking-[0.12em] text-heading"
          >
            Create Service
          </h2>
          <p className="mt-1 text-[0.6875rem] text-body">Base URL only</p>
        </div>

        {/* X Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close create service panel"
          className="inline-flex items-center rounded border border-border p-2 text-body transition-colors hover:bg-white/5"
        >
          <X size={14} />
        </button>
      </div>

      {/* Form Content */}
      <form
        className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Service Name */}
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
            <p className="text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>

        {/* Base URL */}
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
            <p className="text-xs text-red-400">{errors.baseUrl.message}</p>
          )}
        </div>

        {/* Description */}
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
            <p className="text-xs text-red-400">{errors.description.message}</p>
          )}
        </div>

        {/* Environment */}
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

        {/* Active Service */}
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

        {/* Error Message */}
        {errorMessage ? (
          <div className="md:col-span-2 border border-red-500/40 bg-red-500/5 px-3 py-2 text-sm text-red-300">
            {errorMessage}
          </div>
        ) : null}

        {/* Submit Button */}
        <div className="md:col-span-2 flex items-center justify-end gap-3">
          <DashboardButton
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={createServiceMutation.isPending}
          >
            Cancel
          </DashboardButton>
          <DashboardButton
            type="submit"
            variant="primary"
            disabled={createServiceMutation.isPending}
          >
            {createServiceMutation.isPending ? "Creating..." : "Create Service"}
          </DashboardButton>
        </div>
      </form>
    </section>
  );
}
