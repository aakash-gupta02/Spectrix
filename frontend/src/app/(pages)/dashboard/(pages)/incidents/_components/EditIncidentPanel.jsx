"use client";

import DashboardButton from "@/components/ui/DashboardButton";
import FormSelect from "@/components/ui/form/FormSelect";
import FormTextarea from "@/components/ui/form/FormTextarea";
import { IncidentPublicStatus } from "@/enums/incident.enum";
import { updateIncidentSchema } from "@/validation/incident.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDemoAction } from "@/contexts/AuthContext";
import { incidentAPI } from "@/lib/api/api";

function getChangedFields(incident, formData) {
  const changed = {};

  if (incident.publicStatus !== formData.publicStatus) {
    changed.publicStatus = formData.publicStatus;
  }

  if ((incident.description || "") !== (formData.description || "").trim()) {
    changed.description = formData.description?.trim();
  }

  return changed;
}

export default function EditIncidentPanel({
  isOpen,
  incident,
  onClose,
  onUpdated,
}) {
  const queryClient = useQueryClient();
  const checkDemoAction = useDemoAction();

  const [errorMessage, setErrorMessage] = useState("");

  const methods = useForm({
    resolver: zodResolver(updateIncidentSchema),
    defaultValues: {
      publicStatus: IncidentPublicStatus.INVESTIGATING,
      description: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const updateIncidentMutation = useMutation({
    mutationFn: ({ id, payload }) => incidentAPI.updateIncident(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["incidents"],
      });

      setErrorMessage("");
      onUpdated?.("Incident updated successfully.");
      onClose();
    },

    onError: (error) => {
      setErrorMessage(
        error?.response?.data?.message ?? "Could not update incident.",
      );
    },
  });

  useEffect(() => {
    if (!isOpen || !incident) return;

    reset({
      publicStatus: incident.publicStatus ?? IncidentPublicStatus.INVESTIGATING,
      description: incident.description ?? "",
    });

    // setErrorMessage("");
  }, [incident, isOpen, reset]);

  const handleClose = useCallback(() => {
    reset();
    setErrorMessage("");
    onClose();
  }, [reset, onClose]);

  const onSubmit = (data) => {
    if (!checkDemoAction("Updating incident")) return;

    const changedFields = getChangedFields(incident, data);

    if (Object.keys(changedFields).length === 0) {
      setErrorMessage("No changes made.");
      return;
    }

    updateIncidentMutation.mutate({
      id: incident._id,
      payload: changedFields,
    });
  };

  if (!isOpen || !incident) return null;

  return (
    <section className="mb-6 border border-border bg-surface-1">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm uppercase tracking-[0.12em] text-heading">
            Update Public Incident
          </h2>

          <p className="mt-1 text-[0.6875rem] text-body">
            Update the information displayed on your public status page.
          </p>
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
          <div className="space-y-5 p-5">
            <div className="w-64">
              {" "}
              <FormSelect
                name="publicStatus"
                label="Public Status"
                options={[
                  {
                    value: IncidentPublicStatus.INVESTIGATING,
                    label: "Investigating",
                  },
                  {
                    value: IncidentPublicStatus.IDENTIFIED,
                    label: "Identified",
                  },
                  {
                    value: IncidentPublicStatus.MONITORING,
                    label: "Monitoring",
                  },
                  {
                    value: IncidentPublicStatus.RESOLVED,
                    label: "Resolved",
                  },
                ]}
              />
            </div>

            <FormTextarea
              name="description"
              label="Public Description"
              placeholder="We're currently investigating elevated error rates affecting this endpoint..."
              rows={5}
              maxLength={500}
            />

            {errorMessage && (
              <div className="border border-red-500/40 bg-red-500/5 px-3 py-2">
                <p className="text-sm text-red-300">{errorMessage}</p>
              </div>
            )}
          </div>

          <div className="mt-5 flex items-center justify-end gap-3 border-t border-border p-5">
            <DashboardButton
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={updateIncidentMutation.isPending}
            >
              Cancel
            </DashboardButton>

            <DashboardButton
              type="submit"
              variant="primary"
              disabled={updateIncidentMutation.isPending}
            >
              {updateIncidentMutation.isPending
                ? "Saving..."
                : "Update Incident"}
            </DashboardButton>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}
