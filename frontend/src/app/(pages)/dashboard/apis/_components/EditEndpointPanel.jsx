"use client";

import DashboardButton from "@/components/ui/DashboardButton";
import LocalServiceDropdown from "@/components/dashboard/layout/LocalServiceDropdown";
import FormCheckbox from "@/components/ui/form/FormCheckbox";
import FormInput from "@/components/ui/form/FormInput";
import FormSelect from "@/components/ui/form/FormSelect";
import FormTextarea from "@/components/ui/form/FormTextarea";
import { endPointsAPI } from "@/lib/api/api";
import { updateEndpointFormSchema } from "@/validation/endpoint.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

const initialFormState = {
  name: "",
  serviceId: "",
  method: "GET",
  path: "/",
  query: "",
  headers: "",
  body: "",
  interval: "300",
  expectedStatus: "200",
  active: true,
  retries: "0",
};

function normalizePath(value) {
  if (!value) {
    return "/";
  }

  return value.startsWith("/") ? value : `/${value}`;
}

function stringifyJsonValue(value) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  return typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

function parseJsonObject(value, fieldName) {
  const trimmed = String(value || "").trim();

  if (!trimmed) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(trimmed);

    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
      throw new Error();
    }

    return parsed;
  } catch {
    throw new Error(`${fieldName} must be valid JSON object.`);
  }
}

function parseBody(value) {
  const trimmed = String(value || "").trim();

  if (!trimmed) {
    return undefined;
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    return trimmed;
  }
}

function parseExpectedStatus(value) {
  const parsed = String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => Number(item))
    .filter((code) => Number.isInteger(code) && code >= 100 && code <= 599);

  return parsed.length > 0 ? parsed : [200];
}

function toFormState(endpoint) {
  return {
    name: endpoint?.name || "",
    serviceId: endpoint?.serviceId || "",
    method: endpoint?.method || "GET",
    path: endpoint?.path || "/",
    query: stringifyJsonValue(endpoint?.query),
    headers: stringifyJsonValue(endpoint?.headers),
    body: stringifyJsonValue(endpoint?.body),
    interval: String(endpoint?.interval ?? 300),
    expectedStatus: Array.isArray(endpoint?.expectedStatus)
      ? endpoint.expectedStatus.join(", ")
      : "200",
    active: Boolean(endpoint?.active),
    retries: String(endpoint?.retries ?? 0),
  };
}

function getChangedFields(endpoint, formData) {
  const originalState = toFormState(endpoint);
  const changed = {};

  // Field transformations: how to process and send each field
  const fieldTransformations = {
    name: (value) => value.trim(),
    path: (value) => normalizePath(value),
    query: (value) => parseJsonObject(value, "Query"),
    headers: (value) => parseJsonObject(value, "Headers"),
    body: (value) => parseBody(value),
    interval: (value) => Number(value),
    expectedStatus: (value) => parseExpectedStatus(value),
    active: (value) => value,
    serviceId: (value) => value,
    method: (value) => value,
    retries: (value) => Number(value),
  };

  // Loop through form fields and compare with original
  Object.entries(fieldTransformations).forEach(([field, transform]) => {
    if (originalState[field] !== formData[field]) {
      changed[field] = transform(formData[field]);
    }
  });

  return changed;
}

export default function EditEndpointPanel({ isOpen, endpoint, onClose, onUpdated }) {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");
  const nameInputRef = useRef(null);

  const methods = useForm({
    resolver: zodResolver(updateEndpointFormSchema),
    defaultValues: initialFormState,
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = methods;

  const handleClose = useCallback(() => {
    setErrorMessage("");
    reset(initialFormState);
    onClose();
  }, [onClose, reset]);

  const updateEndpointMutation = useMutation({
    mutationFn: ({ id, payload }) => endPointsAPI.updateEndpoint(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apis"] });
      setErrorMessage("");
      onUpdated?.("API endpoint updated successfully.");
      onClose();
    },
    onError: (error) => {
      setErrorMessage(
        error?.response?.data?.message ||
          "Could not update API endpoint. Please review your inputs.",
      );
    },
  });

  useEffect(() => {
    if (!isOpen || !endpoint) {
      return;
    }

    reset(toFormState(endpoint));

    const timer = setTimeout(() => {
      setErrorMessage("");
      nameInputRef.current?.focus();
    }, 0);

    return () => clearTimeout(timer);
  }, [endpoint, isOpen, reset]);

  const onSubmit = (data) => {
    setErrorMessage("");

    const endpointId = endpoint?._id || endpoint?.id;
    if (!endpointId) {
      setErrorMessage("Unable to update this endpoint. Missing endpoint ID.");
      return;
    }

    let changedFields;

    try {
      changedFields = getChangedFields(endpoint, data);
    } catch (error) {
      setErrorMessage(error?.message || "Invalid JSON input.");
      return;
    }

    if (changedFields.query === undefined) {
      delete changedFields.query;
    }

    if (changedFields.headers === undefined) {
      delete changedFields.headers;
    }

    if (changedFields.body === undefined) {
      delete changedFields.body;
    }

    if (changedFields.interval !== undefined) {
      changedFields.interval = Number(data.interval);
    }

    if (changedFields.retries !== undefined) {
      changedFields.retries = Number(data.retries);
    }

    if (Object.keys(changedFields).length === 0) {
      setErrorMessage("No changes made.");
      return;
    }

    updateEndpointMutation.mutate({
      id: endpointId,
      payload: changedFields,
    });
  };

  if (!isOpen || !endpoint) {
    return null;
  }

  return (
    <section
      className="mb-6 border border-dashed border-border bg-surface-1"
      aria-labelledby="edit-endpoint-panel-title"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2
            id="edit-endpoint-panel-title"
            className="text-sm uppercase tracking-[0.12em] text-heading"
          >
            Edit API Endpoint
          </h2>
          <p className="mt-1 text-[0.6875rem] text-body">Update endpoint details and save changes.</p>
        </div>

        <button
          type="button"
          onClick={handleClose}
          aria-label="Close edit API endpoint panel"
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
            label="Endpoint Name"
            placeholder="Home Check"
            maxLength={50}
            inputRef={nameInputRef}
          />

          <div className="space-y-2">
            <Controller
              name="serviceId"
              control={control}
              render={({ field }) => (
                <>
                  <LocalServiceDropdown
                    value={field.value}
                    onChange={field.onChange}
                    label="Service"
                  />
                  {errors.serviceId ? (
                    <p className="text-xs text-red-400">{errors.serviceId.message}</p>
                  ) : null}
                </>
              )}
            />
          </div>

          <FormSelect
            name="method"
            label="Method"
            options={[
              { value: "GET", label: "GET" },
              { value: "POST", label: "POST" },
              { value: "PUT", label: "PUT" },
              { value: "PATCH", label: "PATCH" },
              { value: "DELETE", label: "DELETE" },
            ]}
          />

          <FormInput
            name="path"
            label="Path"
            placeholder="/"
          />

            <FormInput
              name="interval"
              label="Interval (seconds)"
              type="number"
              placeholder="300"
            />
            <FormInput
              name="retries"
              label="Retries"
              type="number"
              placeholder="3"
            />

          <div className="md:col-span-2">
            <FormTextarea
              name="query"
              label="Query Params (JSON object)"
              placeholder='{"foo": "bar"}'
              rows={4}
              className="font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <FormTextarea
              name="headers"
              label="Headers (JSON object)"
              placeholder='{"Authorization": "Bearer token"}'
              rows={4}
              className="font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <FormTextarea
              name="body"
              label="Body"
              placeholder='{"hello": "world"}'
              rows={5}
              className="font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <FormInput
              name="expectedStatus"
              label="Expected Status Codes (comma separated)"
              placeholder="200, 201"
            />
          </div>

          <div className="md:col-span-2 flex items-end">
            <FormCheckbox name="active" label="Active endpoint" />
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
              disabled={updateEndpointMutation.isPending}
            >
              Cancel
            </DashboardButton>
            <DashboardButton
              type="submit"
              variant="primary"
              disabled={updateEndpointMutation.isPending}
            >
              {updateEndpointMutation.isPending ? "Saving..." : "Save changes"}
            </DashboardButton>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}
