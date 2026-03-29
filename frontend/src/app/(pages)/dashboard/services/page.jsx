"use client";

import { serviceAPI } from "@/lib/api/api";
import Container from "@/components/dashboard/common/Container";
import SectionHeading from "@/components/dashboard/common/SectionHeading";
import DashboardButton from "@/components/ui/DashboardButton";
import CreateServiceModal from "./_components/CreateServiceModal";
import EditServicePanel from "./_components/EditServicePanel";
import DeleteServiceModal from "./_components/DeleteServiceModal";
import { Download, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export function formatDate(dateValue) {
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
    const [successMessage, setSuccessMessage] = useState("");
    const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const servicesQuery = useQuery({
        queryKey: ["services"],
        queryFn: serviceAPI.getServices,
    });

    const services = useMemo(() => servicesQuery.data?.service?.services ?? [], [servicesQuery.data]);

    return (
        <Container>
            <SectionHeading
                title="Services"
                description="Add and manage service base URLs. Define endpoints as path-only routes, not full URLs."
            >
                <DashboardButton variant="secondary">
                    <Download size={14} />
                    Export list
                </DashboardButton>

                <DashboardButton
                    variant="primary"
                    onClick={() => {
                        setSuccessMessage("");
                        setIsCreatePanelOpen((prev) => !prev);
                    }}
                >
                    <Plus size={14} />
                    {isCreatePanelOpen ? "Close form" : "New service"}
                </DashboardButton>
            </SectionHeading>

            {/* Create Service Modal */}
            <CreateServiceModal
                isOpen={isCreatePanelOpen}
                onClose={() => setIsCreatePanelOpen(false)}
                onCreated={(message) => {
                    setSuccessMessage(message);
                    setIsCreatePanelOpen(false);
                }}
            />

            <EditServicePanel
                isOpen={isEditPanelOpen}
                service={selectedService}
                onClose={() => {
                    setIsEditPanelOpen(false);
                    setSelectedService(null);
                }}
                onUpdated={(message) => {
                    setSuccessMessage(message);
                    setIsEditPanelOpen(false);
                    setSelectedService(null);
                }}
            />

            <DeleteServiceModal
                isOpen={isDeleteModalOpen}
                service={selectedService}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedService(null);
                }}
                onDeleted={(message) => {
                    setSuccessMessage(message);
                    setIsDeleteModalOpen(false);
                    setSelectedService(null);
                }}
            />

            {/* Success Message from create service modal */}
            {successMessage ? (
                <div className="mb-6 border border-primary/40 bg-primary-soft px-3 py-2 text-sm text-primary">
                    {successMessage}
                </div>
            ) : null}

            {/* All Services Table */}
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
                                <th className="px-4 py-3 font-normal">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {servicesQuery.isLoading ? (
                                <tr>
                                    <td className="px-4 py-6 text-body" colSpan={6}>
                                        Loading services...
                                    </td>
                                </tr>
                            ) : null}

                            {servicesQuery.isError ? (
                                <tr>
                                    <td className="px-4 py-6 text-red-300" colSpan={6}>
                                        {servicesQuery.error?.response?.data?.message ||
                                            "Could not load services."}
                                    </td>
                                </tr>
                            ) : null}

                            {/* No Services Data Message */}
                            {!servicesQuery.isLoading && !servicesQuery.isError && services.length === 0 ? (
                                <tr>
                                    <td className="px-4 py-6 text-body" colSpan={6}>
                                        No services yet. Create your first service above.
                                    </td>
                                </tr>
                            ) : null}

                            {/* Service Rows */}
                            {services.map((service) => (
                                <tr key={service._id || service.id || service.baseUrl} className="border-b border-border/60 last:border-b-0">

                                    {/* Service Name and Description */}
                                    <td className="px-4 py-3 text-heading">
                                        <p>{service.name || "-"}</p>
                                        <p className="mt-1 text-xs text-body">{service.description || "No description"}</p>
                                    </td>

                                    {/* Base URL */}
                                    <td className="px-4 py-3 font-mono text-xs text-body-strong">{service.baseUrl || "-"}</td>

                                    {/* Environment */}
                                    <td className="px-4 py-3 capitalize text-body">{service.environment || "-"}</td>

                                    {/* Active Status */}
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

                                    {/* Date */}
                                    <td className="px-4 py-3 text-body">{formatDate(service.createdAt)}</td>

                                    {/* Actions */}
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <DashboardButton
                                                type="button"
                                                variant="secondary"
                                                className="hover:border-primary/40 hover:bg-primary-soft hover:text-primary"
                                            >
                                                <Eye size={13} />
                                                Monitor
                                            </DashboardButton>
                                            <DashboardButton
                                                type="button"
                                                variant="secondary"
                                                className="hover:border-primary/40 hover:bg-primary-soft hover:text-primary"
                                                onClick={() => {
                                                    setSelectedService(service);
                                                    setIsCreatePanelOpen(false);
                                                    setIsEditPanelOpen(true);
                                                }}
                                            >
                                                <Pencil size={13} />

                                            </DashboardButton>
                                            <DashboardButton
                                                type="button"
                                                variant="secondary"
                                                className="hover:border-primary/40 hover:bg-primary-soft hover:text-primary"
                                                onClick={() => {
                                                    setSelectedService(service);
                                                    setIsCreatePanelOpen(false);
                                                    setIsEditPanelOpen(false);
                                                    setIsDeleteModalOpen(true);
                                                }}
                                            >
                                                <Trash2 size={13} />
                                            </DashboardButton>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </Container>
    );
}