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
import { useService } from "@/contexts/ServiceContext";
import { useRouter } from "next/navigation";

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
  const [selectedServiceRecord, setSelectedServiceRecord] = useState(null);
  const router = useRouter();

  const { setSelectedServiceId, setSelectedService } = useService();

  const handleMonitor = (service) => {
    setSelectedServiceId(service._id);
    setSelectedService(service);

    router.push("/dashboard/apis");
  };

  const servicesQuery = useQuery({
    queryKey: ["services"],
    queryFn: serviceAPI.getServices,
  });

  const services = useMemo(
    () => servicesQuery.data?.service?.services ?? [],
    [servicesQuery.data],
  );

  return (
    <Container>
      <SectionHeading
        title="Services"
        description="Add and manage service base URLs. Define endpoints as path-only routes, not full URLs."
        docLink="/docs/services"
      >
        {/* <DashboardButton variant="secondary">
                    <Download size={14} />
                    Export list
                </DashboardButton> */}

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
        service={selectedServiceRecord}
        onClose={() => {
          setIsEditPanelOpen(false);
          setSelectedServiceRecord(null);
        }}
        onUpdated={(message) => {
          setSuccessMessage(message);
          setIsEditPanelOpen(false);
          setSelectedServiceRecord(null);
        }}
      />

      <DeleteServiceModal
        isOpen={isDeleteModalOpen}
        service={selectedServiceRecord}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedServiceRecord(null);
        }}
        onDeleted={(message) => {
          setSuccessMessage(message);
          setIsDeleteModalOpen(false);
          setSelectedServiceRecord(null);
        }}
      />

      {/* Success Message from create service modal */}
      {successMessage ? (
        <div className="mb-6 border border-primary/40 bg-primary-soft px-3 py-2 text-sm text-primary">
          {successMessage}
        </div>
      ) : null}

      {/* All Services Table */}
      <ServiceTable
        services={services}
        servicesQuery={servicesQuery}
        onMonitor={handleMonitor}
        onEdit={(service) => {
          setSelectedServiceRecord(service);
          setIsCreatePanelOpen(false);
          setIsEditPanelOpen(true);
        }}
        onDelete={(service) => {
          setSelectedServiceRecord(service);
          setIsCreatePanelOpen(false);
          setIsEditPanelOpen(false);
          setIsDeleteModalOpen(true);
        }}
      />
    </Container>
  );
}
