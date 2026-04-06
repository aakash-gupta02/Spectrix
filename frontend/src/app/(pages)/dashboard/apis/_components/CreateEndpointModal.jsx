"use client";

import DashboardButton from "@/components/ui/DashboardButton";
import LocalServiceDropdown from "@/components/dashboard/layout/LocalServiceDropdown";
import FormCheckbox from "@/components/ui/form/FormCheckbox";
import FormInput from "@/components/ui/form/FormInput";
import FormSelect from "@/components/ui/form/FormSelect";
import FormTextarea from "@/components/ui/form/FormTextarea";
import { endPointsAPI } from "@/lib/api/api";
import { createEndpointFormSchema } from "@/validation/endpoint.validation";
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
  interval: 300,
  expectedStatus: "200",
  active: true,
};

function normalizePath(value) {
  if (!value) {
    return "/";
  }

  return value.startsWith("/") ? value : `/${value}`;
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

export default function CreateEndpointModal({ isOpen, onClose, onCreated }) {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");
  const nameInputRef = useRef(null);

  const methods = useForm({
    resolver: zodResolver(createEndpointFormSchema),
    defaultValues: initialFormState,
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = methods;

  const createEndpointMutation = useMutation({
    mutationFn: endPointsAPI.createEndpoint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apis"] });
      reset(initialFormState);
      setErrorMessage("");
      onCreated?.("API endpoint created successfully.");
      onClose();
    },
    onError: (error) => {
      setErrorMessage(
        error?.response?.data?.message ||
          "Could not create API endpoint. Please check your input.",
      );
    },
  });

  const handleClose = useCallback(() => {
    setErrorMessage("");
    reset(initialFormState);
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
    setErrorMessage("");

    let parsedQuery;
    let parsedHeaders;

    try {
      parsedQuery = parseJsonObject(data.query, "Query");
      parsedHeaders = parseJsonObject(data.headers, "Headers");
    } catch (error) {
      setErrorMessage(error?.message || "Invalid JSON input.");
      return;
    }

    createEndpointMutation.mutate({
      name: data.name.trim(),
      serviceId: data.serviceId,
      method: data.method,
      path: normalizePath(data.path),
      ...(parsedQuery ? { query: parsedQuery } : {}),
      ...(parsedHeaders ? { headers: parsedHeaders } : {}),
      ...(data.body?.trim() ? { body: parseBody(data.body) } : {}),
      interval: data.interval,
      expectedStatus: parseExpectedStatus(data.expectedStatus),
      active: Boolean(data.active),
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <section
      className="mb-6 border border-dashed border-border bg-surface-1"
      aria-labelledby="create-endpoint-panel-title"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2
            id="create-endpoint-panel-title"
            className="text-sm uppercase tracking-[0.12em] text-heading"
          >
            Create API Endpoint
          </h2>
          <p className="mt-1 text-[0.6875rem] text-body">Path only, not full URL</p>
        </div>

        <button
          type="button"
          onClick={handleClose}
          aria-label="Close create API endpoint panel"
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

          <div className="md:col-span-2">
            <FormInput
              name="interval"
              label="Interval (seconds)"
              type="number"
              placeholder="300"
            />
          </div>

          <div className="md:col-span-2">
            <FormTextarea
              name="query"
              label="Query Params (JSON object) (Optional)"
              placeholder='{"foo": "bar"}'
              rows={4}
              className="font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <FormTextarea
              name="headers"
              label="Headers (JSON object) (Optional)"
              placeholder='{"Authorization": "Bearer token"}'
              rows={4}
              className="font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <FormTextarea
              name="body"
              label="Body (Optional)"
              placeholder='{"hello": "world"}'
              rows={5}
              className="font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <FormInput
              name="expectedStatus"
              label="Expected Status Codes (comma separated) (Optional)"
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
              disabled={createEndpointMutation.isPending}
            >
              Cancel
            </DashboardButton>
            <DashboardButton
              type="submit"
              variant="primary"
              disabled={createEndpointMutation.isPending}
            >
              {createEndpointMutation.isPending ? "Creating..." : "Create API"}
            </DashboardButton>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}
