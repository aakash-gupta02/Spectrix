"use client"
import { serviceAPI } from '@/lib/api/api';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react'
import React, { useMemo, useState } from 'react'

const ServiceDropDown = () => {
    const [selectedServiceId, setSelectedServiceId] = useState("all");

    const servicesQuery = useQuery({
        queryKey: ["services"],
        queryFn: serviceAPI.getServices,
    });

    const services = useMemo(() => servicesQuery.data?.service?.services ?? [], [servicesQuery.data]);

    const selectedService = useMemo(() => {
        if (selectedServiceId === "all") {
            return null;
        }

        return services.find((service) => (service._id || service.id || service.baseUrl) === selectedServiceId) ?? null;
    }, [services, selectedServiceId]);

    const getServiceValue = (service) => service._id || service.id || service.baseUrl;

    const getServiceLabel = (service) => {
        const serviceName = service?.name || "Unnamed service";
        const environment = service?.environment || "unknown";
        const baseUrl = service?.baseUrl || "-";

        return `${serviceName} (${environment}) - ${baseUrl}`;
    };



    return (
        <div className="border-b border-dashed border-border px-4 py-4">
            <label htmlFor="service-selector" className="mb-2 block text-[0.625rem] uppercase tracking-[0.12em] text-muted">
                Service
            </label>

            <div className="relative">
                <select
                    id="service-selector"
                    value={selectedServiceId}
                    onChange={(event) => setSelectedServiceId(event.target.value)}
                    disabled={servicesQuery.isLoading || servicesQuery.isError}
                    className="w-full appearance-none rounded border border-border bg-white/5 px-3 py-2 pr-8 text-xs text-heading outline-none transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <option value="all">All Services</option>

                    {services.map((service) => (
                        <option key={getServiceValue(service)} value={getServiceValue(service)}>
                            {getServiceLabel(service)}
                        </option>
                    ))}
                </select>

                <ChevronDown size={16} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-body" />
            </div>

            {servicesQuery.isLoading ? (
                <p className="mt-2 text-[0.625rem] text-body">Loading services...</p>
            ) : null}

            {servicesQuery.isError ? (
                <p className="mt-2 text-[0.625rem] text-red-300">Could not load services.</p>
            ) : null}

            {!servicesQuery.isLoading && !servicesQuery.isError && services.length === 0 ? (
                <p className="mt-2 text-[0.625rem] text-body">No services available.</p>
            ) : null}

            {!servicesQuery.isLoading && !servicesQuery.isError && selectedService ? (
                <div className="mt-2 min-w-0 space-y-1 text-[0.625rem] text-body">
                    <p className="truncate text-heading">{selectedService.name || "Unnamed service"}</p>
                    <p className="truncate">{selectedService.environment || "unknown"}</p>
                    <p className="truncate font-mono text-[0.6rem]">{selectedService.baseUrl || "-"}</p>
                </div>
            ) : null}
        </div>)
}

export default ServiceDropDown