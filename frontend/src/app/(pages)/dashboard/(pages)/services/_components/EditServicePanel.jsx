"use client";

import DashboardButton from "@/components/ui/DashboardButton";
import FormCheckbox from "@/components/ui/form/FormCheckbox";
import FormInput from "@/components/ui/form/FormInput";
import FormSelect from "@/components/ui/form/FormSelect";
import { serviceAPI } from "@/lib/api/api";
import { updateServiceSchema } from "@/validation/service.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDemoAction } from "@/contexts/AuthContext";

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

function getChangedFields(service, formData) {
  const original = toFormState(service);
  const normalized = {
    ...formData,
    name: formData.name?.trim() || "",
    baseUrl: formData.baseUrl?.trim() || "",
    description: formData.description?.trim() || "",
    active: Boolean(formData.active),
  };
  const changed = {};

  Object.entries(normalized).forEach(([field, value]) => {
    if (original[field] !== value) {
      changed[field] = field === "description" ? value || undefined : value;
    }
  });

  return changed;
}

export default function EditServicePanel({
  isOpen,
  service,
  onClose,
  onUpdated,
}) {
  const queryClient = useQueryClient();
  const checkDemoAction = useDemoAction();
  const [errorMessage, setErrorMessage] = useState("");
  const nameInputRef = useRef(null);

  const methods = useForm({
    resolver: zodResolver(updateServiceSchema),
    defaultValues: initialFormState,
  });

  const { handleSubmit, reset } = methods;

  const handleClose = useCallback(() => {
    setErrorMessage("");
    reset(initialFormState);
    onClose();
  }, [onClose, reset]);

  const updateServiceMutation = useMutation({
    mutationFn: ({ id, payload }) => serviceAPI.updateService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      reset(initialFormState);
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
    if (!isOpen || !service) {
      return;
    }

    reset(toFormState(service));

    const timer = setTimeout(() => {
      setErrorMessage("");
      nameInputRef.current?.focus();
    }, 0);

    return () => clearTimeout(timer);
  }, [isOpen, service, reset]);

  const onSubmit = (data) => {
    setErrorMessage("");

    if (!checkDemoAction("Updating a service")) {
      return;
    }

    const serviceId = service?._id || service?.id;
    if (!serviceId) {
      setErrorMessage("Unable to update this service. Missing service ID.");
      return;
    }

    const changedFields = getChangedFields(service, data);

    if (Object.keys(changedFields).length === 0) {
      setErrorMessage("No changes made.");
      return;
    }

    updateServiceMutation.mutate({
      id: serviceId,
      payload: changedFields,
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
          onClick={handleClose}
          aria-label="Close edit service panel"
          className="inline-flex items-center rounded border border-border p-2 text-body transition-colors hover:bg-white/5"
        >
          <X size={14} />
        </button>
      </div>

      <FormProvider {...methods}>
        <form
          className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormInput
            name="name"
            label="Service Name"
            placeholder="Payments API"
            maxLength={50}
            inputRef={nameInputRef}
          />

          <FormInput
            name="baseUrl"
            label="Base URL"
            type="url"
            placeholder="https://api.example.com"
          />

          <div className="md:col-span-2">
            <FormInput
              name="description"
              label="Description (optional)"
              maxLength={100}
              placeholder="Tracks checkout and order processing services"
            />
          </div>

          <FormSelect
            name="environment"
            label="Environment"
            options={[
              { value: "development", label: "Development" },
              { value: "staging", label: "Staging" },
              { value: "production", label: "Production" },
            ]}
          />

          <div className="flex items-end">
            <FormCheckbox name="active" label="Active Service" />
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
              onClick={handleClose}
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
      </FormProvider>
    </section>
  );
}
