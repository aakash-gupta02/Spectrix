"use client";

import { serviceAPI } from "@/lib/api/api";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useMemo, useState } from "react";

const ServiceContext = createContext(null);

export function ServiceProvider({ children }) {
  const [selectedServiceId, setSelectedServiceId] = useState("all");
  const [selectedService, setSelectedService] = useState(null);

  // Fetch services data
  const servicesQuery = useQuery({
    queryKey: ["services"],
    queryFn: serviceAPI.getServices,
  });

  const services = useMemo(() => servicesQuery.data?.service?.services ?? [], [servicesQuery.data]);

  const value = useMemo(
    () => ({
      selectedServiceId,
      selectedService,
      setSelectedServiceId,
      setSelectedService,
      services,
      servicesLoading: servicesQuery.isLoading,
      servicesError: servicesQuery.isError,
      servicesQuery,
    }),
    [selectedService, selectedServiceId, services, servicesQuery],
  );

  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>;
}

export function useService() {
  const context = useContext(ServiceContext);

  if (!context) {
    throw new Error("useService must be used within a ServiceProvider");
  }

  return context;
}
