"use client";

import Container from "@/components/dashboard/common/Container";
import SectionHeading from "@/components/dashboard/common/SectionHeading";
import DashboardButton from "@/components/ui/DashboardButton";
import { useService } from "@/contexts/ServiceContext";
import { streamAPI } from "@/lib/api/api";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import CreateStreamPanel from "./_components/CreateStreamPanel";
import DeleteStreamModal from "./_components/DeleteStreamModal";
import EditStreamPanel from "./_components/EditStreamPanel";
import StreamTable from "./_components/StreamTable";

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

export default function StreamsPage() {
  const { services } = useService();
  const [successMessage, setSuccessMessage] = useState("");
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStream, setSelectedStream] = useState(null);

  const streamsQuery = useQuery({
    queryKey: ["streams"],
    queryFn: streamAPI.getStreams,
  });

  const streams = useMemo(
    () => streamsQuery.data?.streams ?? [],
    [streamsQuery.data],
  );

  const serviceLookup = useMemo(() => {
    return (services || []).reduce((lookup, service) => {
      const serviceId = service?._id || service?.id;

      if (serviceId) {
        lookup[serviceId] = service;
      }

      return lookup;
    }, {});
  }, [services]);

  return (
    <Container>
      <SectionHeading
        title="Streams"
        description="Generate and manage stream keys for the services in your workspace."
        docLink="/docs/realtime-streaming"
      >
        <DashboardButton
          variant="primary"
          onClick={() => {
            setSuccessMessage("");
            setIsCreatePanelOpen((prev) => !prev);
          }}
        >
          <Plus size={14} />
          {isCreatePanelOpen ? "Close form" : "New stream"}
        </DashboardButton>
      </SectionHeading>

      <CreateStreamPanel
        isOpen={isCreatePanelOpen}
        onClose={() => setIsCreatePanelOpen(false)}
        onCreated={(message) => {
          setSuccessMessage(message);
        }}
      />

      <EditStreamPanel
        isOpen={isEditPanelOpen}
        stream={selectedStream}
        onClose={() => {
          setIsEditPanelOpen(false);
          setSelectedStream(null);
        }}
        onUpdated={(message) => {
          setSuccessMessage(message);
          setIsEditPanelOpen(false);
          setSelectedStream(null);
        }}
      />

      <DeleteStreamModal
        isOpen={isDeleteModalOpen}
        stream={selectedStream}
        serviceLookup={serviceLookup}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedStream(null);
        }}
        onDeleted={(message) => {
          setSuccessMessage(message);
          setIsDeleteModalOpen(false);
          setSelectedStream(null);
        }}
      />

      {successMessage ? (
        <div className="mb-6 border border-primary/40 bg-primary-soft px-3 py-2 text-sm text-primary">
          {successMessage}
        </div>
      ) : null}

      <StreamTable
        streams={streams}
        streamsQuery={streamsQuery}
        serviceLookup={serviceLookup}
        onEdit={(stream) => {
          setSelectedStream(stream);
          setIsCreatePanelOpen(false);
          setIsDeleteModalOpen(false);
          setIsEditPanelOpen(true);
        }}
        onDelete={(stream) => {
          setSelectedStream(stream);
          setIsCreatePanelOpen(false);
          setIsEditPanelOpen(false);
          setIsDeleteModalOpen(true);
        }}
      />
    </Container>
  );
}