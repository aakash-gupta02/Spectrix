"use client";

import DashboardButton from "@/components/ui/DashboardButton";
import { endPointsAPI, serviceAPI } from "@/lib/api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const initialFormState = {
  name: "",
  serviceId: "",
  method: "GET",
  path: "/",
  expectedStatus: "200",
  active: true,
};

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
  const [formData, setFormData] = useState(initialFormState);
  const [errorMessage, setErrorMessage] = useState("");
  const nameInputRef = useRef(null);

  const servicesQuery = useQuery({
    queryKey: ["services"],
    queryFn: serviceAPI.getServices,
  });

  const services = useMemo(() => servicesQuery.data?.service?.services ?? [], [servicesQuery.data]);
  const firstServiceId = services[0]?._id || services[0]?.id || "";

  const createEndpointMutation = useMutation({
    mutationFn: endPointsAPI.createEndpoint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apis"] });
      setFormData(initialFormState);
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
    setFormData(initialFormState);
    onClose();
  }, [onClose]);

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

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage("");

    const resolvedServiceId = formData.serviceId || firstServiceId;

    if (!resolvedServiceId) {
      setErrorMessage("Please select a service.");
      return;
    }

    const normalizedPath = formData.path.startsWith("/") ? formData.path : `/${formData.path}`;

    createEndpointMutation.mutate({
      name: formData.name.trim(),
      serviceId: resolvedServiceId,
      method: formData.method,
      path: normalizedPath,
      expectedStatus: parseExpectedStatus(formData.expectedStatus),
      active: Boolean(formData.active),
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

      <form className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-[0.12em] text-muted">Endpoint Name</label>
          <input
            ref={nameInputRef}
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            maxLength={80}
            placeholder="Home Check"
            className="w-full rounded border border-border bg-surface-2 px-3 py-2 text-sm text-heading outline-none transition focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-[0.12em] text-muted">Service</label>
          <select
            required
            name="serviceId"
            value={formData.serviceId || firstServiceId}
            onChange={handleChange}
            className="w-full rounded border border-border bg-surface-2 px-3 py-2 text-sm text-heading outline-none transition focus:border-primary"
          >
            <option value="">Select service</option>
            {services.map((service) => {
              const serviceId = service?._id || service?.id;
              if (!serviceId) {
                return null;
              }

              return (
                <option key={serviceId} value={serviceId}>
                  {service?.name || "Unnamed service"}
                </option>
              );
            })}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-[0.12em] text-muted">Method</label>
          <select
            name="method"
            value={formData.method}
            onChange={handleChange}
            className="w-full rounded border border-border bg-surface-2 px-3 py-2 text-sm text-heading outline-none transition focus:border-primary"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-[0.12em] text-muted">Path</label>
          <input
            required
            name="path"
            value={formData.path}
            onChange={handleChange}
            placeholder="/"
            className="w-full rounded border border-border bg-surface-2 px-3 py-2 font-mono text-sm text-heading outline-none transition focus:border-primary"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-xs uppercase tracking-[0.12em] text-muted">
            Expected Status Codes (comma separated)
          </label>
          <input
            name="expectedStatus"
            value={formData.expectedStatus}
            onChange={handleChange}
            placeholder="200, 201"
            className="w-full rounded border border-border bg-surface-2 px-3 py-2 text-sm text-heading outline-none transition focus:border-primary"
          />
        </div>

        <div className="md:col-span-2 flex items-end">
          <label className="flex items-center gap-2 text-sm text-body">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="h-4 w-4 accent-primary"
            />
            Active endpoint
          </label>
        </div>

        {servicesQuery.isError ? (
          <div className="md:col-span-2 border border-red-500/40 bg-red-500/5 px-3 py-2 text-sm text-red-300">
            Could not load services. Create at least one service first.
          </div>
        ) : null}

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
            disabled={createEndpointMutation.isPending || services.length === 0}
          >
            {createEndpointMutation.isPending ? "Creating..." : "Create API"}
          </DashboardButton>
        </div>
      </form>
    </section>
  );
}
