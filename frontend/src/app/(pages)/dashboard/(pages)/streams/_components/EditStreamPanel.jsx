"use client";

import DashboardButton from "@/components/ui/DashboardButton";
import FormCheckbox from "@/components/ui/form/FormCheckbox";
import FormInput from "@/components/ui/form/FormInput";
import { useDemoAction } from "@/contexts/AuthContext";
import { streamAPI } from "@/lib/api/api";
import { updateStreamSchema } from "@/validation/stream.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

const initialFormState = {
  name: "",
  isActive: true,
};

function toFormState(stream) {
  return {
    name: stream?.name || "",
    isActive: Boolean(stream?.isActive),
  };
}

function getChangedFields(stream, formData) {
  const original = toFormState(stream);
  const normalized = {
    name: formData.name?.trim() || "",
    isActive: Boolean(formData.isActive),
  };
  const changed = {};

  Object.entries(normalized).forEach(([field, value]) => {
    if (original[field] !== value) {
      changed[field] = value;
    }
  });

  return changed;
}

export default function EditStreamPanel({ isOpen, stream, onClose, onUpdated }) {
  const queryClient = useQueryClient();
  const checkDemoAction = useDemoAction();
  const [errorMessage, setErrorMessage] = useState("");
  const nameInputRef = useRef(null);

  const methods = useForm({
    resolver: zodResolver(updateStreamSchema),
    defaultValues: initialFormState,
  });

  const { handleSubmit, reset } = methods;

  const handleClose = useCallback(() => {
    setErrorMessage("");
    reset(initialFormState);
    onClose();
  }, [onClose, reset]);

  const updateStreamMutation = useMutation({
    mutationFn: ({ id, payload }) => streamAPI.updateStream(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["streams"] });
      reset(initialFormState);
      setErrorMessage("");
      onUpdated?.("Stream updated successfully.");
      onClose();
    },
    onError: (error) => {
      setErrorMessage(
        error?.response?.data?.message ||
          "Could not update stream. Please review your inputs.",
      );
    },
  });

  useEffect(() => {
    if (!isOpen || !stream) {
      return;
    }

    reset(toFormState(stream));

    const timer = setTimeout(() => {
      setErrorMessage("");
      nameInputRef.current?.focus();
    }, 0);

    return () => clearTimeout(timer);
  }, [isOpen, reset, stream]);

  const onSubmit = (data) => {
    setErrorMessage("");

    if (!checkDemoAction("Updating a stream")) {
      return;
    }

    const streamId = stream?._id || stream?.id;
    if (!streamId) {
      setErrorMessage("Unable to update this stream. Missing stream ID.");
      return;
    }

    const changedFields = getChangedFields(stream, data);

    if (Object.keys(changedFields).length === 0) {
      setErrorMessage("No changes made.");
      return;
    }

    updateStreamMutation.mutate({
      id: streamId,
      payload: changedFields,
    });
  };

  if (!isOpen || !stream) {
    return null;
  }

  return (
    <section
      className="mb-6 border border-dashed border-border bg-surface-1"
      aria-labelledby="edit-stream-panel-title"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2
            id="edit-stream-panel-title"
            className="text-sm uppercase tracking-[0.12em] text-heading"
          >
            Edit Stream
          </h2>
          <p className="mt-1 text-[0.6875rem] text-body">
            Update the stream name or active state.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClose}
          aria-label="Close edit stream panel"
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
            label="Stream Name"
            placeholder="Payments stream"
            maxLength={50}
            inputRef={nameInputRef}
          />

          <div className="flex items-end">
            <FormCheckbox name="isActive" label="Active stream" />
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
              disabled={updateStreamMutation.isPending}
            >
              Cancel
            </DashboardButton>
            <DashboardButton
              type="submit"
              variant="primary"
              disabled={updateStreamMutation.isPending}
            >
              {updateStreamMutation.isPending ? "Saving..." : "Save changes"}
            </DashboardButton>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}