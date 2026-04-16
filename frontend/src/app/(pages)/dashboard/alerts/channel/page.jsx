"use client";

import Container from "@/components/dashboard/common/Container";
import SectionHeading from "@/components/dashboard/common/SectionHeading";
import DashboardButton from "@/components/ui/DashboardButton";
import { alertChannelAPI } from "@/lib/api/api";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import AlertChannelTable from "./_components/AlertChannelTable";
import CreateAlertChannelModal from "./_components/CreateAlertChannelModal";
import DeleteAlertChannelModal from "./_components/DeleteAlertChannelModal";

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

export default function AlertChannelPage() {
  const [successMessage, setSuccessMessage] = useState("");
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);

  const alertChannelQuery = useQuery({
    queryKey: ["alert-channels"],
    queryFn: alertChannelAPI.getAlertChannels,
  });

  const channels = useMemo(
    () => alertChannelQuery.data?.alertChannels ?? [],
    [alertChannelQuery.data],
  );

  return (
    <Container>
      <SectionHeading
        title="Alert Channels"
        description="Manage webhook channels used for alert delivery."
      >
        <DashboardButton
          variant="primary"
          onClick={() => {
            setSuccessMessage("");
            setIsCreatePanelOpen((prev) => !prev);
          }}
        >
          <Plus size={14} />
          {isCreatePanelOpen ? "Close form" : "New channel"}
        </DashboardButton>
      </SectionHeading>

      <CreateAlertChannelModal
        isOpen={isCreatePanelOpen}
        onClose={() => setIsCreatePanelOpen(false)}
        onCreated={(message) => {
          setSuccessMessage(message);
          setIsCreatePanelOpen(false);
        }}
      />

      <DeleteAlertChannelModal
        isOpen={isDeleteModalOpen}
        channel={selectedChannel}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedChannel(null);
        }}
        onDeleted={(message) => {
          setSuccessMessage(message);
          setIsDeleteModalOpen(false);
          setSelectedChannel(null);
        }}
      />

      {successMessage ? (
        <div className="mb-6 border border-primary/40 bg-primary-soft px-3 py-2 text-sm text-primary">
          {successMessage}
        </div>
      ) : null}

      <AlertChannelTable
        channels={channels}
        alertChannelQuery={alertChannelQuery}
        onDelete={(channel) => {
          setSelectedChannel(channel);
          setIsCreatePanelOpen(false);
          setIsDeleteModalOpen(true);
        }}
      />
    </Container>
  );
}
