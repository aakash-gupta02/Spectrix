"use client";

import DashboardButton from "@/components/ui/DashboardButton";
import { serviceAPI } from "@/lib/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createServiceSchema } from "@/validation/service.validation";
import FormInput from "@/components/ui/form/FormInput";
import { useDemoAction } from "@/contexts/AuthContext";
import FormSelect from "@/components/ui/form/FormSelect";
import FormCheckbox from "@/components/ui/form/FormCheckbox";

const initialFormState = {
  name: "",
  description: "",
  baseUrl: "",
  environment: "development",
  active: true,
};

export default function CreateServiceModal({ isOpen, onClose, onCreated }) {
  const queryClient = useQueryClient();
  const checkDemoAction = useDemoAction();
  const [errorMessage, setErrorMessage] = useState("");
  const nameInputRef = useRef(null);

  const methods = useForm({
    resolver: zodResolver(createServiceSchema),
    defaultValues: initialFormState,
  });

  const { handleSubmit, reset } = methods;

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
  }, [isOpen]);

  const onSubmit = (data) => {
    if (!checkDemoAction("Creating a service")) {
      return;
    }

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
      <FormProvider {...methods}>
        <form
          className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Service Name */}
          <FormInput
            name="name"
            label="Service Name"
            placeholder="Payments API"
            maxLength={50}
            inputRef={nameInputRef}
          />

          {/* Base URL */}
          <FormInput
            name="baseUrl"
            label="Base URL"
            type="url"
            placeholder="https://api.example.com"
          />

          {/* Description */}
          <FormInput
            name="description"
            label="Description (optional)"
            maxLength={100}
            placeholder="Tracks checkout and order processing services"
          />

          {/* Environment */}
          <FormSelect
            name="environment"
            label="Environment"
            options={[
              { value: "development", label: "Development" },
              { value: "staging", label: "Staging" },
              { value: "production", label: "Production" },
            ]}
          />

          {/* Active Service */}
          <FormCheckbox name="active" label="Active Service" />

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
              {createServiceMutation.isPending
                ? "Creating..."
                : "Create Service"}
            </DashboardButton>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}
