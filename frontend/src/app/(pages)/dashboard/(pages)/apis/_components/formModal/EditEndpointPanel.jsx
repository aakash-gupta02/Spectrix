"use client";

import DashboardButton from "@/components/ui/DashboardButton";
import { endPointsAPI } from "@/lib/api/api";
import { updateEndpointFormSchema } from "@/validation/endpoint.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDemoAction } from "@/contexts/AuthContext";
import { 
  EndpointFormFields, 
  convertKeyValueToObject, 
  objectToKeyValueArray,
  parseBody, 
  parseExpectedStatus,
  stringifyJsonValue,
  normalizePath 
} from "./EndpointFormFields";

function getChangedFields(endpoint, formData) {
  const changed = {};

  // Compare basic fields
  if (endpoint.name !== formData.name.trim()) changed.name = formData.name.trim();
  if (endpoint.method !== formData.method) changed.method = formData.method;
  if (normalizePath(endpoint.path) !== normalizePath(formData.path)) changed.path = normalizePath(formData.path);
  if (endpoint.interval !== Number(formData.interval)) changed.interval = Number(formData.interval);
  if ((endpoint.retries || 0) !== Number(formData.retries)) changed.retries = Number(formData.retries);
  if (endpoint.active !== formData.active) changed.active = formData.active;
  
  // Status codes
  const currentStatus = Array.isArray(endpoint.expectedStatus) 
    ? endpoint.expectedStatus.join(", ") 
    : "200";
  if (currentStatus !== formData.expectedStatus) {
    changed.expectedStatus = parseExpectedStatus(formData.expectedStatus);
  }

  // Query params
  const currentQuery = convertKeyValueToObject(objectToKeyValueArray(endpoint.query));
  const newQuery = convertKeyValueToObject(formData.queryParams);
  if (JSON.stringify(currentQuery) !== JSON.stringify(newQuery)) {
    if (newQuery && Object.keys(newQuery).length > 0) changed.query = newQuery;
    else if (currentQuery && !newQuery) changed.query = undefined;
  }

  // Headers
  const currentHeaders = convertKeyValueToObject(objectToKeyValueArray(endpoint.headers));
  const newHeaders = convertKeyValueToObject(formData.headers);
  if (JSON.stringify(currentHeaders) !== JSON.stringify(newHeaders)) {
    if (newHeaders && Object.keys(newHeaders).length > 0) changed.headers = newHeaders;
    else if (currentHeaders && !newHeaders) changed.headers = undefined;
  }

  // Body
  if (stringifyJsonValue(endpoint.body) !== formData.body) {
    if (formData.body?.trim()) changed.body = parseBody(formData.body);
    else if (endpoint.body) changed.body = undefined;
  }

  return changed;
}

export default function EditEndpointPanel({ isOpen, endpoint, onClose, onUpdated }) {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");
  const nameInputRef = useRef(null);
  const checkDemoAction = useDemoAction();

  const methods = useForm({
    resolver: zodResolver(updateEndpointFormSchema),
    defaultValues: {
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
    },
  });

  const { handleSubmit, reset, control, formState: { errors } } = methods;

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

  const handleClose = useCallback(() => {
    setErrorMessage("");
    reset();
    onClose();
  }, [onClose, reset]);

  useEffect(() => {
    if (!isOpen || !endpoint) return;

    reset({
      name: endpoint.name || "",
      serviceId: endpoint.serviceId || "",
      method: endpoint.method || "GET",
      path: endpoint.path || "/",
      queryParams: objectToKeyValueArray(endpoint.query),
      headers: objectToKeyValueArray(endpoint.headers),
      body: stringifyJsonValue(endpoint.body),
      interval: endpoint.interval || 300,
      expectedStatus: Array.isArray(endpoint.expectedStatus)
        ? endpoint.expectedStatus.join(", ")
        : "200",
      active: Boolean(endpoint.active),
      retries: String(endpoint.retries || 0),
    });

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

    if (!checkDemoAction("Updating an endpoint")) return;

    const changedFields = getChangedFields(endpoint, data);

    if (Object.keys(changedFields).length === 0) {
      setErrorMessage("No changes made.");
      return;
    }

    updateEndpointMutation.mutate({
      id: endpointId,
      payload: changedFields,
    });
  };

  if (!isOpen || !endpoint) return null;

  return (
    <section className="mb-6 border border-border bg-surface-1">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm uppercase tracking-[0.12em] text-heading">Edit API Endpoint</h2>
          <p className="mt-1 text-[0.6875rem] text-body">Update endpoint details and save changes.</p>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="inline-flex items-center rounded border border-border p-2 text-body transition-colors hover:bg-white/5"
        >
          <X size={14} />
        </button>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <EndpointFormFields 
            control={control} 
            errors={errors} 
            nameInputRef={nameInputRef}
            showServiceDropdown={true}
          />

          {errorMessage && (
            <div className="mx-5 mb-5 border border-red-500/40 bg-red-500/5 px-3 py-2">
              <p className="text-sm text-red-300">{errorMessage}</p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 p-5 pt-0 border-t border-border mt-5">
            <DashboardButton type="button" variant="secondary" onClick={handleClose} disabled={updateEndpointMutation.isPending}>
              Cancel
            </DashboardButton>
            <DashboardButton type="submit" variant="primary" disabled={updateEndpointMutation.isPending}>
              {updateEndpointMutation.isPending ? "Saving..." : "Save changes"}
            </DashboardButton>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}