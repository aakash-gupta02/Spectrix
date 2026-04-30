"use client";

import DashboardButton from "@/components/ui/DashboardButton";
import { endPointsAPI } from "@/lib/api/api";
import { createEndpointFormSchema } from "@/validation/endpoint.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDemoAction } from "@/contexts/AuthContext";
import { 
  EndpointFormFields, 
  convertKeyValueToObject, 
  parseBody, 
  parseExpectedStatus,
  normalizePath 
} from "./EndpointFormFields";

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

export default function CreateEndpointModal({ isOpen, onClose, onCreated }) {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");
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
    if (!isOpen) return;
    const timer = setTimeout(() => nameInputRef.current?.focus(), 0);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const onSubmit = (data) => {
    setErrorMessage("");

    if (!checkDemoAction("Creating an endpoint")) return;

    const parsedQuery = convertKeyValueToObject(data.queryParams);
    const parsedHeaders = convertKeyValueToObject(data.headers);
    let parsedBody;

    try {
      if (data.body?.trim()) parsedBody = parseBody(data.body);
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

  if (!isOpen) return null;

  return (
    <section className="mb-6 border border-border bg-surface-1">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm uppercase tracking-[0.12em] text-heading">Create API Endpoint</h2>
          <p className="mt-1 text-[0.6875rem] text-body">Configure your API endpoint monitoring</p>
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
          <EndpointFormFields control={control} errors={errors} nameInputRef={nameInputRef} />

          {errorMessage && (
            <div className="mx-5 mb-5 border border-red-500/40 bg-red-500/5 px-3 py-2">
              <p className="text-sm text-red-300">{errorMessage}</p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 p-5 pt-0 border-t border-border mt-5">
            <DashboardButton type="button" variant="secondary" onClick={handleClose} disabled={createEndpointMutation.isPending}>
              Cancel
            </DashboardButton>
            <DashboardButton type="submit" variant="primary" disabled={createEndpointMutation.isPending} className="flex items-center gap-2">
              <Plus size={14} />
              {createEndpointMutation.isPending ? "Creating..." : "Create API"}
            </DashboardButton>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}