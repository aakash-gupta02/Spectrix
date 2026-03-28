"use client";

import { createContext, useContext, useMemo, useState } from "react";

const ServiceContext = createContext(null);

export function ServiceProvider({ children }) {
  const [selectedServiceId, setSelectedServiceId] = useState("all");
  const [selectedService, setSelectedService] = useState(null);

  const value = useMemo(
    () => ({
      selectedServiceId,
      selectedService,
      setSelectedServiceId,
      setSelectedService,
    }),
    [selectedService, selectedServiceId],
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
