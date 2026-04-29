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
import { X, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { useDemoAction } from "@/contexts/AuthContext";

const initialFormState = {
  name: "",
  serviceId: "",
  method: "GET",
  path: "/",
  queryParams: [{ key: "", value: "" }],
  headers: [{ key: "", value: "" }],
  body: "",
  interval: 300,
  expectedStatus: "200",
  active: true,
  retries: "1",
};

function normalizePath(value) {
  if (!value) {
    return "/";
  }

  return value.startsWith("/") ? value : `/${value}`;
}

function convertKeyValueToObject(keyValueArray) {
  const obj = {};
  keyValueArray.forEach((item) => {
    if (item.key && item.key.trim()) {
      obj[item.key.trim()] = item.value || "";
    }
  });
  return Object.keys(obj).length > 0 ? obj : undefined;
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
  const [activeTab, setActiveTab] = useState("config");
  const nameInputRef = useRef(null);
  const checkDemoAction = useDemoAction();

  const methods = useForm({
    resolver: zodResolver(createEndpointFormSchema),
    defaultValues: initialFormState,
  });

  const {
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = methods;

  const {
    fields: queryFields,
    append: appendQuery,
    remove: removeQuery,
  } = useFieldArray({
    control,
    name: "queryParams",
  });

  const {
    fields: headerFields,
    append: appendHeader,
    remove: removeHeader,
  } = useFieldArray({
    control,
    name: "headers",
  });

  const selectedMethod = useWatch({
    control,
    name: "method",
    defaultValue: initialFormState.method,
  });

  const selectedPath = useWatch({
    control,
    name: "path",
    defaultValue: initialFormState.path,
  });

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

    if (!checkDemoAction("Creating an endpoint")) {
      return;
    }

    const parsedQuery = convertKeyValueToObject(data.queryParams);
    const parsedHeaders = convertKeyValueToObject(data.headers);
    let parsedBody;

    try {
      if (data.body?.trim()) {
        parsedBody = parseBody(data.body);
      }
    } catch (error) {
      setErrorMessage("Invalid JSON in body.");
      return;
    }

    createEndpointMutation.mutate({
      name: data.name.trim(),
      serviceId: data.serviceId,
      method: data.method,
      path: normalizePath(data.path),
      ...(parsedQuery ? { query: parsedQuery } : {}),
      ...(parsedHeaders ? { headers: parsedHeaders } : {}),
      ...(parsedBody ? { body: parsedBody } : {}),
      interval: data.interval,
      expectedStatus: parseExpectedStatus(data.expectedStatus),
      active: Boolean(data.active),
      retries: Number(data.retries),
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <section
      className="mb-6 border border-border bg-surface-1"
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
          <p className="mt-1 text-[0.6875rem] text-body">
            Configure your API endpoint monitoring
          </p>
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
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Basic Info Section - Always visible */}
          <div className="border-b border-border p-5">
            <h3 className="text-sm font-medium text-heading mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                        <p className="text-xs text-red-400">
                          {errors.serviceId.message}
                        </p>
                      ) : null}
                    </>
                  )}
                />
              </div>

              <div className="md:col-span-2">
            {/* <h3 className="text-sm font-medium text-heading mb-4">
              Request Configuration
            </h3> */}
                <div className="flex flex-wrap gap-3">
                  <div className="w-28">
                    <FormSelect
                      name="method"
                      label="HTTP Method"
                      options={[
                        { value: "GET", label: "GET" },
                        { value: "POST", label: "POST" },
                        { value: "PUT", label: "PUT" },
                        { value: "PATCH", label: "PATCH" },
                        { value: "DELETE", label: "DELETE" },
                      ]}
                    />
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <FormInput name="path" 
                    label="Endpoint Path"
                    placeholder="/users or /posts/1" />
                  </div>

                  <div className="w-32">
                    <FormInput
                      name="interval"
                      label="Interval (sec)"
                      type="number"
                      placeholder="300"
                    />
                  </div>

                  <div className="w-24">
                    <FormInput
                      name="retries"
                      label="Retries"
                      type="number"
                      placeholder="3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs for additional config */}
          <div className="border-b border-border bg-surface-2 px-5">
            <div className="flex gap-6">
              {[
                { id: "config", label: "Config" },
                { id: "params", label: "Query Params" },
                { id: "headers", label: "Headers" },
                { id: "body", label: "Body" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-0 py-2 text-sm font-medium border-b-2 transition-all ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-body hover:text-heading"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-5">
            {/* Config Tab */}
            {activeTab === "config" && (
              <div className="space-y-5">
                <FormInput
                  name="expectedStatus"
                  label="Expected Status Codes (comma separated)"
                  placeholder="200, 201, 204"
                />

                <div className="border-t border-border pt-4">
                  <FormCheckbox name="active" label="Active endpoint" />
                  <p className="mt-1 text-xs text-body/60">
                    Disabled endpoints won`&apos;`t be monitored
                  </p>
                </div>
              </div>
            )}

            {/* Query Params Tab - Key/Value pairs */}
            {activeTab === "params" && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-medium text-heading">
                    Query Parameters
                  </label>
                  <button
                    type="button"
                    onClick={() => appendQuery({ key: "", value: "" })}
                    className="text-xs text-primary hover:text-primary/80"
                  >
                    + Add Parameter
                  </button>
                </div>

                <div className="space-y-2">
                  {queryFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <FormInput
                          name={`queryParams.${index}.key`}
                          placeholder="Key"
                          className="font-mono text-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <FormInput
                          name={`queryParams.${index}.value`}
                          placeholder="Value"
                          className="font-mono text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeQuery(index)}
                        className="mt-2 p-1 text-body/60 hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {queryFields.length === 0 && (
                  <p className="text-xs text-body/60 text-center py-4">
                    No query parameters. Click `&quot;`Add Parameter`&quot;` to add one.
                  </p>
                )}
              </div>
            )}

            {/* Headers Tab - Key/Value pairs */}
            {activeTab === "headers" && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-medium text-heading">
                    Headers
                  </label>
                  <button
                    type="button"
                    onClick={() => appendHeader({ key: "", value: "" })}
                    className="text-xs text-primary hover:text-primary/80"
                  >
                    + Add Header
                  </button>
                </div>

                <div className="space-y-2">
                  {headerFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <FormInput
                          name={`headers.${index}.key`}
                          placeholder="Header Name"
                          className="font-mono text-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <FormInput
                          name={`headers.${index}.value`}
                          placeholder="Header Value"
                          className="font-mono text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeHeader(index)}
                        className="mt-2 p-1 text-body/60 hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {headerFields.length === 0 && (
                  <p className="text-xs text-body/60 text-center py-4">
                    No headers. Click `&quot;`Add Header`&quot;` to add one.
                  </p>
                )}
              </div>
            )}

            {/* Body Tab - JSON textarea */}
            {activeTab === "body" && (
              <div>
                <FormTextarea
                  name="body"
                  label="Request Body (JSON)"
                  placeholder='{"key": "value"}'
                  rows={8}
                  className="font-mono"
                />
                <p className="mt-1 text-xs text-body/60">
                  {selectedMethod === "GET"
                    ? "Note: GET requests typically don't have a body"
                    : "Enter valid JSON for the request body"}
                </p>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-4 border border-red-500/40 bg-red-500/5 px-3 py-2">
                <p className="text-sm text-red-300">{errorMessage}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border">
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
                className="flex items-center gap-2"
              >
                <Plus size={14} />
                {createEndpointMutation.isPending
                  ? "Creating..."
                  : "Create API"}
              </DashboardButton>
            </div>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}
