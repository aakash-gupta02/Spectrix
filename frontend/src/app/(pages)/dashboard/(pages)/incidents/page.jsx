"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Container from "@/components/dashboard/common/Container";
import SectionHeading from "@/components/dashboard/common/SectionHeading";
import LocalServiceFilterDropdown from "@/components/dashboard/layout/LocalServiceFilterDropdown";

import useServiceFiltering from "@/hooks/useServiceFiltering";
import { incidentAPI } from "@/lib/api/api";

import IncidentTable from "./_components/IncidentTable";
import EditIncidentPanel from "./_components/EditIncidentPanel";

const Page = () => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const { localServiceId, activeServiceFilter, setLocalFilter } =
    useServiceFiltering();

  const incidentQuery = useQuery({
    queryKey: ["incidents", activeServiceFilter],
    queryFn: () =>
      incidentAPI.getIncidents({
        serviceId: activeServiceFilter,
      }),
  });

  const incidents = useMemo(
    () => incidentQuery.data?.incidents?.incidents ?? [],
    [incidentQuery.data],
  );

  return (
    <Container>
      <SectionHeading
        title="Incidents"
        description="Track ongoing and historical outages across APIs."
      >
        <LocalServiceFilterDropdown
          value={localServiceId}
          onChange={setLocalFilter}
          allOptionLabel="All Services"
        />
      </SectionHeading>

      <EditIncidentPanel
        isOpen={!!selectedIncident}
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onUpdated={(message) => {
          setSuccessMessage(message);
          setSelectedIncident(null);
        }}
      />

      {successMessage && (
        <div className="mb-6 border border-primary/40 bg-primary-soft px-3 py-2 text-sm text-primary">
          {successMessage}
        </div>
      )}

      <IncidentTable
        incidents={incidents}
        incidentsQuery={incidentQuery}
        onEdit={(incident) => {
          setSuccessMessage("");
          setSelectedIncident(incident);
        }}
      />
    </Container>
  );
};

export default Page;
