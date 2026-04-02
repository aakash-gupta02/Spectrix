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
import ServiceTable from "./_components/ServiceTable";

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
            <ServiceTable services={services} servicesQuery={servicesQuery}
                onEdit={(service) => {
                    setSelectedService(service);
                    setIsCreatePanelOpen(false);
                    setIsEditPanelOpen(true);
                }}

                onDelete={(service) => {
                    setSelectedService(service);
                    setIsCreatePanelOpen(false);
                    setIsEditPanelOpen(false);
                    setIsDeleteModalOpen(true);
                }}
            />

        </Container>
    );
}