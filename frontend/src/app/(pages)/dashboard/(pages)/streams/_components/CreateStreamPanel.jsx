"use client";

import DashboardButton from "@/components/ui/DashboardButton";
import FormInput from "@/components/ui/form/FormInput";
import FormSelect from "@/components/ui/form/FormSelect";
import { useDemoAction } from "@/contexts/AuthContext";
import { useService } from "@/contexts/ServiceContext";
import { streamAPI } from "@/lib/api/api";
import { createStreamSchema } from "@/validation/stream.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Copy, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

const initialFormState = {
  name: "",
  serviceId: "",
};

export default function CreateStreamPanel({ isOpen, onClose, onCreated }) {
  const queryClient = useQueryClient();
  const checkDemoAction = useDemoAction();
  const { services, servicesLoading } = useService();
  const [errorMessage, setErrorMessage] = useState("");
  const [createdResult, setCreatedResult] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const nameInputRef = useRef(null);

  const methods = useForm({
    resolver: zodResolver(createStreamSchema),
    defaultValues: initialFormState,
  });

  const { handleSubmit, reset, watch } = methods;
  const selectedServiceId = watch("serviceId");

  const serviceOptions = useMemo(() => {
    const options = [
      { value: "", label: servicesLoading ? "Loading services..." : "Select a service" },
    ];

    (services || []).forEach((service) => {
      const serviceId = service?._id || service?.id;

      if (serviceId) {
        options.push({
          value: serviceId,
          label: service?.name ? `${service.name} · ${service.environment || service.baseUrl || "service"}` : serviceId,
        });
      }
    });

    return options;
  }, [services, servicesLoading]);

  const selectedServiceName = useMemo(() => {
    if (!selectedServiceId) {
      return "";
    }

    const selectedService = (services || []).find((service) => (service._id || service?.id) === selectedServiceId);
    return selectedService?.name || "Selected service";
  }, [selectedServiceId, services]);

  const handleClose = useCallback(() => {
    setErrorMessage("");
    setCreatedResult(null);
    setCopySuccess(false);
    reset(initialFormState);
    onClose();
  }, [onClose, reset]);

  const createStreamMutation = useMutation({
    mutationFn: streamAPI.createStream,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["streams"] });
      setErrorMessage("");
      setCopySuccess(false);
      setCreatedResult({
        stream: data?.stream,
        rawKey: data?.rawKey,
      });
      onCreated?.(data?.message || "Stream created successfully.");
    },
    onError: (error) => {
      setErrorMessage(
        error?.response?.data?.message ||
          "Could not create stream. Please check your input.",
      );
    },
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timer = setTimeout(() => {
      nameInputRef.current?.focus();
    }, 0);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleCopy = async () => {
    if (!createdResult?.rawKey || typeof navigator === "undefined") {
      return;
    }

    await navigator.clipboard.writeText(createdResult.rawKey);
    setCopySuccess(true);

    window.setTimeout(() => setCopySuccess(false), 1800);
  };

  const onSubmit = (data) => {
    setErrorMessage("");

    if (!checkDemoAction("Creating a stream")) {
      return;
    }

    if (!services.length) {
      setErrorMessage("Create a service first before generating a stream key.");
      return;
    }

    createStreamMutation.mutate({
      name: data.name.trim(),
      serviceId: data.serviceId,
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <section
      className="mb-6 border border-dashed border-border bg-surface-1"
      aria-labelledby="create-stream-panel-title"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2
            id="create-stream-panel-title"
            className="text-sm uppercase tracking-[0.12em] text-heading"
          >
            Create Stream
          </h2>
          <p className="mt-1 text-[0.6875rem] text-body">
            Generate a one-time live stream key for a service.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClose}
          aria-label="Close create stream panel"
          className="inline-flex items-center rounded border border-border p-2 text-body transition-colors hover:bg-white/5"
        >
          <X size={14} />
        </button>
      </div>

      {createdResult ? (
        <div className="space-y-4 p-5">
          <div className="rounded border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            Stream created successfully. Copy the key now because it will not be shown again.
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded border border-border bg-surface-2 p-4">
              <p className="text-[0.6875rem] uppercase tracking-[0.12em] text-muted">Stream</p>
              <p className="mt-2 text-heading">{createdResult.stream?.name || "New stream"}</p>
              <p className="mt-1 text-xs text-body">
                {selectedServiceName || "Service selected during creation"}
              </p>
            </div>

            <div className="rounded border border-border bg-surface-2 p-4">
              <p className="text-[0.6875rem] uppercase tracking-[0.12em] text-muted">Key Preview</p>
              <p className="mt-2 font-mono text-xs text-body-strong">
                {createdResult.stream?.keyPreview || "-"}
              </p>
            </div>
          </div>

          <div className="rounded border border-border bg-black/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[0.6875rem] uppercase tracking-[0.12em] text-muted">Raw Key</p>
                <p className="mt-2 break-all font-mono text-sm text-heading">
                  {createdResult.rawKey || "-"}
                </p>
              </div>

              <DashboardButton type="button" variant="secondary" onClick={handleCopy}>
                {copySuccess ? <Check size={14} /> : <Copy size={14} />}
                {copySuccess ? "Copied" : "Copy key"}
              </DashboardButton>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
            <DashboardButton
              type="button"
              variant="secondary"
              onClick={() => {
                setCreatedResult(null);
                setCopySuccess(false);
                setErrorMessage("");
                reset(initialFormState);
                window.setTimeout(() => nameInputRef.current?.focus(), 0);
              }}
            >
              Create another stream
            </DashboardButton>

            <DashboardButton type="button" variant="primary" onClick={handleClose}>
              Close
            </DashboardButton>
          </div>
        </div>
      ) : (
        <FormProvider {...methods}>
          <form
            className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormInput
              name="name"
              label="Stream Name"
              placeholder="Payments stream"
              maxLength={50}
              inputRef={nameInputRef}
            />

            <FormSelect
              name="serviceId"
              label="Service"
              options={serviceOptions}
            />

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
                disabled={createStreamMutation.isPending}
              >
                Cancel
              </DashboardButton>
              <DashboardButton
                type="submit"
                variant="primary"
                disabled={createStreamMutation.isPending || servicesLoading}
              >
                {createStreamMutation.isPending ? "Creating..." : "Create Stream"}
              </DashboardButton>
            </div>
          </form>
        </FormProvider>
      )}
    </section>
  );
}