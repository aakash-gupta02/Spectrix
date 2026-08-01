"use client";

import { useEffect, useMemo } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import DashboardButton from "@/components/ui/DashboardButton";
import FormInput from "@/components/ui/form/FormInput";
import FormSelect from "@/components/ui/form/FormSelect";
import FormTextarea from "@/components/ui/form/FormTextarea";
import {
  createStatuspageSettingsSchema,
  updateStatuspageSettingsSchema,
} from "@/validation/statuspage.validation";
import StatusPagePublicUrlCard from "./StatusPagePublicUrlCard";
import StatusPageServicesField from "./StatusPageServicesField";
import { useDemoAction } from "@/contexts/AuthContext";

const DEFAULT_VALUES = {
  name: "",
  description: "",
  logoUrl: "",
  slug: "",
  visibility: "public",
  serviceIds: [],
};

function getServiceId(service) {
  return service?._id || service?.id || service?.serviceId || "";
}

export default function StatusPageSettingsForm({
  initialValues,
  services = [],
  selectedServiceIds = [],
  availableServiceIds = [],
  saving,
  isCreating,
  publicUrl,
  onCreate,
  onUpdate,
  onCancelCreate,
}) {
  const checkDemoAction = useDemoAction();

  const schema = isCreating
    ? createStatuspageSettingsSchema
    : updateStatuspageSettingsSchema;

  const defaultValues = isCreating
    ? {
        name: "",
        description: "",
        logoUrl: "",
        visibility: "public",
        serviceIds: [],
      }
    : DEFAULT_VALUES;

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    shouldUnregister: true,
  });

  const { handleSubmit, reset, control } = methods;

  const initialFormValues = useMemo(() => {
    const derivedServiceIds =
      selectedServiceIds.length > 0
        ? selectedServiceIds
        : isCreating
          ? availableServiceIds
          : [];

    return {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      logoUrl: initialValues?.logoUrl || "",
      visibility: initialValues?.isPublic === false ? "private" : "public",
      serviceIds: derivedServiceIds,
      ...(isCreating ? {} : { slug: initialValues?.slug || "" }),
    };
  }, [availableServiceIds, initialValues, isCreating, selectedServiceIds]);

  useEffect(() => {
    reset(initialFormValues);
  }, [initialFormValues, reset]);

  const serviceSummary = useMemo(
    () =>
      initialFormValues.serviceIds
        .map(
          (serviceId) =>
            services.find((service) => getServiceId(service) === serviceId)
              ?.name,
        )
        .filter(Boolean),
    [initialFormValues.serviceIds, services],
  );

  const submitHandler = (data) => {
    if (!checkDemoAction("Creating a status page")) return;

    const payload = {
      name: data.name.trim(),
      description: data.description?.trim() || "",
      logoUrl: data.logoUrl?.trim() || "",
      isPublic: data.visibility === "public",
      serviceIds: data.serviceIds,
    };

    if (!isCreating) {
      payload.slug = data.slug.trim();
    }

    if (isCreating) {
      onCreate(payload);
      return;
    }

    onUpdate(payload);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
        <section
          className="border border-dashed border-border bg-surface-1"
          aria-labelledby="status-page-settings-title"
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2
                id="status-page-settings-title"
                className="text-sm uppercase tracking-[0.12em] text-heading"
              >
                {isCreating ? "Create Status Page" : "Settings"}
              </h2>
              <p className="mt-1 text-[0.6875rem] text-body">
                {isCreating
                  ? "Configure branding, visibility, and services for your public status page."
                  : "Update status page branding, slug, and visibility."}
              </p>
            </div>

            {isCreating ? (
              <button
                type="button"
                onClick={onCancelCreate}
                aria-label="Cancel create status page"
                className="inline-flex items-center rounded border border-border p-2 text-body transition-colors hover:bg-white/5"
              >
                <X size={14} />
              </button>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
            <FormInput
              name="name"
              label="Name"
              placeholder="Acme Inc."
              maxLength={100}
            />

            {!isCreating ? (
              <FormInput
                name="slug"
                label="Slug"
                placeholder="acme"
                maxLength={100}
              />
            ) : null}

            <div className="md:col-span-2">
              <FormTextarea
                name="description"
                label="Description"
                placeholder="Status updates and incident history."
                rows={4}
              />
            </div>

            <FormInput
              name="logoUrl"
              label="Logo URL"
              placeholder="https://..."
            />

            <FormSelect
              name="visibility"
              label="Visibility"
              options={[
                { value: "public", label: "Public" },
                { value: "private", label: "Private" },
              ]}
            />
          </div>
        </section>

        <section className="border border-dashed border-border bg-surface-1">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm uppercase tracking-[0.12em] text-heading">
              Services
            </h3>
            <p className="mt-1 text-[0.6875rem] text-body">
              Select the services that should appear on the status page. Drag
              handle is shown now; reordering can be enabled later.
            </p>
          </div>

          <div className="p-5">
            <Controller
              name="serviceIds"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <StatusPageServicesField
                    services={services}
                    selectedServiceIds={field.value || []}
                    onChange={field.onChange}
                  />
                  {fieldState?.error ? (
                    <p className="mt-2 text-xs text-red-400">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </>
              )}
            />
          </div>
        </section>

        {!isCreating ? (
          <StatusPagePublicUrlCard
            publicUrl={publicUrl}
            serviceSummary={serviceSummary}
          />
        ) : null}

        <div className="flex items-center justify-end gap-3">
          {isCreating ? (
            <DashboardButton
              type="button"
              variant="secondary"
              onClick={onCancelCreate}
              disabled={saving}
            >
              Cancel
            </DashboardButton>
          ) : null}
          <DashboardButton type="submit" variant="primary" disabled={saving}>
            {saving
              ? "Saving…"
              : isCreating
                ? "Create Status Page"
                : "Save Changes"}
          </DashboardButton>
        </div>
      </form>
    </FormProvider>
  );
}
