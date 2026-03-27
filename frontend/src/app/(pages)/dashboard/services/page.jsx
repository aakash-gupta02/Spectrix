"use client";

import { serviceAPI } from "@/lib/api/api";
import Container from "@/components/dashboard/common/Container";
import SectionHeading from "@/components/dashboard/common/SectionHeading";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

const initialFormState = {
    name: "",
    description: "",
    baseUrl: "",
    environment: "development",
    active: true,
};

function formatDate(dateValue) {
    if (!dateValue) {
        return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    }).format(date);
}

export default function ServicePage() {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState(initialFormState);
    const [successMessage, setSuccessMessage] = useState("");

    const servicesQuery = useQuery({
        queryKey: ["services"],
        queryFn: serviceAPI.getServices,
    });

    const createServiceMutation = useMutation({
        mutationFn: serviceAPI.createService,
        onSuccess: () => {
            setSuccessMessage("Service created successfully.");
            setFormData(initialFormState);
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
        onError: () => {
            setSuccessMessage("");
        },
    });

    const services = useMemo(() => servicesQuery.data?.service?.services ?? [], [servicesQuery.data]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSuccessMessage("");

        createServiceMutation.mutate({
            ...formData,
            description: formData.description?.trim() || undefined,
        });
    };

    return (
        <Container>
            <SectionHeading
                title="Services"
                description="Add and manage service base URLs. Define endpoints as path-only routes, not full URLs."
            />

            <div className="mb-6 border border-dashed border-border bg-surface-1 p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between border-b border-border pb-3">
                    <h2 className="text-sm uppercase tracking-[0.12em] text-heading">Create Service</h2>
                    <span className="text-[0.6875rem] text-body">Base URL only</span>
                </div>

                <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="block text-xs uppercase tracking-[0.12em] text-muted">Service Name</label>
                        <input
                            required
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            maxLength={50}
                            placeholder="Payments API"
                            className="w-full rounded border border-border bg-surface-2 px-3 py-2 text-sm text-heading outline-none transition focus:border-primary"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs uppercase tracking-[0.12em] text-muted">Base URL</label>
                        <input
                            required
                            type="url"
                            name="baseUrl"
                            value={formData.baseUrl}
                            onChange={handleChange}
                            placeholder="https://api.example.com"
                            className="w-full rounded border border-border bg-surface-2 px-3 py-2 text-sm text-heading outline-none transition focus:border-primary"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="block text-xs uppercase tracking-[0.12em] text-muted">Description (optional)</label>
                        <input
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            maxLength={100}
                            placeholder="Tracks checkout and order processing services"
                            className="w-full rounded border border-border bg-surface-2 px-3 py-2 text-sm text-heading outline-none transition focus:border-primary"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs uppercase tracking-[0.12em] text-muted">Environment</label>
                        <select
                            name="environment"
                            value={formData.environment}
                            onChange={handleChange}
                            className="w-full rounded border border-border bg-surface-2 px-3 py-2 text-sm text-heading outline-none transition focus:border-primary"
                        >
                            <option value="development">Development</option>
                            <option value="staging">Staging</option>
                            <option value="production">Production</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <label className="flex items-center gap-2 text-sm text-body">
                            <input
                                type="checkbox"
                                name="active"
                                checked={formData.active}
                                onChange={handleChange}
                                className="h-4 w-4 accent-primary"
                            />
                            Active service
                        </label>
                    </div>

                    {createServiceMutation.isError ? (
                        <div className="md:col-span-2 border border-red-500/40 bg-red-500/5 px-3 py-2 text-sm text-red-300">
                            {createServiceMutation.error?.response?.data?.message ||
                                "Could not create service. Please check your input."}
                        </div>
                    ) : null}

                    {successMessage ? (
                        <div className="md:col-span-2 border border-primary/40 bg-primary-soft px-3 py-2 text-sm text-primary">
                            {successMessage}
                        </div>
                    ) : null}

                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={createServiceMutation.isPending}
                            className="rounded border border-primary/40 bg-primary px-4 py-2 text-sm font-medium text-black transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {createServiceMutation.isPending ? "Creating..." : "Create Service"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="overflow-hidden border border-dashed border-border bg-surface-1">
                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                    <h2 className="text-sm uppercase tracking-[0.12em] text-heading">All Services</h2>
                    <span className="text-[0.6875rem] text-body">{services.length} total</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-border bg-surface-2 text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                                <th className="px-4 py-3 font-normal">Name</th>
                                <th className="px-4 py-3 font-normal">Base URL</th>
                                <th className="px-4 py-3 font-normal">Environment</th>
                                <th className="px-4 py-3 font-normal">Status</th>
                                <th className="px-4 py-3 font-normal">Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {servicesQuery.isLoading ? (
                                <tr>
                                    <td className="px-4 py-6 text-body" colSpan={5}>
                                        Loading services...
                                    </td>
                                </tr>
                            ) : null}

                            {servicesQuery.isError ? (
                                <tr>
                                    <td className="px-4 py-6 text-red-300" colSpan={5}>
                                        {servicesQuery.error?.response?.data?.message ||
                                            "Could not load services."}
                                    </td>
                                </tr>
                            ) : null}

                            {!servicesQuery.isLoading && !servicesQuery.isError && services.length === 0 ? (
                                <tr>
                                    <td className="px-4 py-6 text-body" colSpan={5}>
                                        No services yet. Create your first service above.
                                    </td>
                                </tr>
                            ) : null}

                            {services.map((service) => (
                                <tr key={service._id || service.id || service.baseUrl} className="border-b border-border/60 last:border-b-0">
                                    <td className="px-4 py-3 text-heading">
                                        <p>{service.name || "-"}</p>
                                        <p className="mt-1 text-xs text-body">{service.description || "No description"}</p>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs text-body-strong">{service.baseUrl || "-"}</td>
                                    <td className="px-4 py-3 capitalize text-body">{service.environment || "-"}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex rounded border px-2 py-1 text-[0.6875rem] ${service.active
                                                ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-300"
                                                : "border-rose-500/35 bg-rose-500/10 text-rose-300"
                                                }`}
                                        >
                                            {service.active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-body">{formatDate(service.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Container>
    );
}