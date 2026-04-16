"use client";

import DashboardButton from "@/components/ui/DashboardButton";
import FormCheckbox from "@/components/ui/form/FormCheckbox";
import FormInput from "@/components/ui/form/FormInput";
import FormSelect from "@/components/ui/form/FormSelect";
import { alertChannelAPI } from "@/lib/api/api";
import { createAlertChannelFormSchema } from "@/validation/alertChannel.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

const initialFormState = {
  type: "webhook",
  url: "",
  isActive: true,
};

export default function CreateAlertChannelModal({ isOpen, onClose, onCreated }) {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");
  const urlInputRef = useRef(null);

  const methods = useForm({
    resolver: zodResolver(createAlertChannelFormSchema),
    defaultValues: initialFormState,
  });

  const { handleSubmit, reset } = methods;

  const createAlertChannelMutation = useMutation({
    mutationFn: alertChannelAPI.createAlertChannel,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["alert-channels"] });
      reset(initialFormState);
      setErrorMessage("");
      onCreated?.(data?.message || "Alert channel created successfully.");
      onClose();
    },
    onError: (error) => {
      setErrorMessage(
        error?.response?.data?.message ||
          "Could not create alert channel. Please check your input.",
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
      urlInputRef.current?.focus();
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen]);

  const onSubmit = (data) => {
    setErrorMessage("");
    createAlertChannelMutation.mutate({
      type: data.type,
      url: data.url.trim(),
      isActive: Boolean(data.isActive),
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <section
      className="mb-6 border border-dashed border-border bg-surface-1"
      aria-labelledby="create-alert-channel-panel-title"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2
            id="create-alert-channel-panel-title"
            className="text-sm uppercase tracking-[0.12em] text-heading"
          >
            Create Alert Channel
          </h2>
          <p className="mt-1 text-[0.6875rem] text-body">
            Add Discord, Slack, or custom webhook destination
          </p>
        </div>

        <button
          type="button"
          onClick={handleClose}
          aria-label="Close create alert channel panel"
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
          <FormSelect
            name="type"
            label="Channel Type"
            options={[
              { value: "webhook", label: "Webhook" },
              { value: "slack", label: "Slack" },
              { value: "discord", label: "Discord" },
            ]}
          />

          <FormInput
            name="url"
            label="Webhook URL"
            type="url"
            placeholder="https://example.com/webhook"
            inputRef={urlInputRef}
          />

          <div className="md:col-span-2 flex items-end">
            <FormCheckbox name="isActive" label="Active channel" />
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
              disabled={createAlertChannelMutation.isPending}
            >
              Cancel
            </DashboardButton>
            <DashboardButton
              type="submit"
              variant="primary"
              disabled={createAlertChannelMutation.isPending}
            >
              {createAlertChannelMutation.isPending
                ? "Creating..."
                : "Create Channel"}
            </DashboardButton>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}
