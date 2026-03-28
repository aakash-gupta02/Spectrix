"use client";

import { serviceAPI } from "@/lib/api/api";
import { useService } from "@/contexts/ServiceContext";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import DashboardButton from "@/components/ui/DashboardButton";
import { useRouter } from "next/navigation";

const ServiceDropDown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const {
        selectedServiceId,
        selectedService,
        setSelectedServiceId,
        setSelectedService,
    } = useService();
    const router = useRouter();

    const servicesQuery = useQuery({
        queryKey: ["services"],
        queryFn: serviceAPI.getServices,
    });

    const services = useMemo(() => servicesQuery.data?.service?.services ?? [], [servicesQuery.data]);

    const resolvedSelectedService = useMemo(() => {
        if (selectedServiceId === "all") {
            return null;
        }

        return services.find((service) => (service._id || service.id || service.baseUrl) === selectedServiceId) ?? null;
    }, [services, selectedServiceId]);

    useEffect(() => {
        setSelectedService(resolvedSelectedService);
    }, [resolvedSelectedService, setSelectedService]);

    useEffect(() => {
        if (selectedServiceId === "all" || services.length === 0) {
            return;
        }

        const serviceStillExists = services.some(
            (service) => (service._id || service.id || service.baseUrl) === selectedServiceId,
        );

        if (!serviceStillExists) {
            setSelectedServiceId("all");
        }
    }, [selectedServiceId, services, setSelectedServiceId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!menuRef.current || menuRef.current.contains(event.target)) {
                return;
            }

            setIsOpen(false);
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const currentName = resolvedSelectedService?.name || "All Services";
    const currentMeta =
        resolvedSelectedService?.environment ||
        resolvedSelectedService?.baseUrl ||
        "All environments";

    return (
        <div ref={menuRef} className="border-b border-dashed border-border px-4 py-4">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                disabled={servicesQuery.isError}
                className="flex w-full items-center justify-between rounded bg-white/5 px-3 py-2 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <div className="flex min-w-0 items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-primary text-xs font-medium text-black">
                        {resolvedSelectedService ? (resolvedSelectedService.name || "S").charAt(0).toUpperCase() : "A"}
                    </div>
                    <div className="flex min-w-0 flex-col text-left">
                        <span className="truncate text-xs text-heading">{currentName}</span>
                        <span className="truncate text-[0.625rem] text-body">{currentMeta}</span>
                    </div>
                </div>
                <ChevronDown size={16} className="shrink-0 text-body" />
            </button>


            {isOpen ? (
                <div className="mt-2 max-h-64 overflow-auto rounded border border-border bg-surface-2 p-1 shadow-lg" role="listbox">
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedServiceId("all");
                            setIsOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded px-2 py-2 text-left text-xs transition-colors ${selectedServiceId === "all"
                            ? "bg-white/10 text-heading"
                            : "text-body hover:bg-white/5 hover:text-heading"
                            }`}
                    >
                        <span className="truncate">All Services</span>
                        <span className="ml-2 shrink-0 text-[0.625rem] text-muted">all env</span>
                    </button>

                    {services.map((service) => {
                        const value = service._id || service.id || service.baseUrl;
                        const serviceName = service?.name || "Unnamed service";
                        const serviceMeta = service?.environment || service?.baseUrl || "unknown";

                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => {
                                    setSelectedServiceId(value);
                                    setIsOpen(false);
                                }}
                                className={`mt-1 flex w-full items-center justify-between rounded px-2 py-2 text-left text-xs transition-colors ${selectedServiceId === value
                                    ? "bg-white/10 text-heading"
                                    : "text-body hover:bg-white/5 hover:text-heading"
                                    }`}
                            >
                                <span className="min-w-0 truncate">{serviceName}</span>
                                <span className="ml-2 max-w-[45%] truncate text-[0.625rem] text-muted">{serviceMeta}</span>
                            </button>
                        );
                    })}

                    <DashboardButton 
                    onClick={() => {
                        setIsOpen(false);
                        router.push("/dashboard/services");
                    }} variant="primary" className=" w-full" >
                        Manage Services
                    </DashboardButton>

                    {servicesQuery.isLoading ? (
                        <p className="px-2 py-2 text-[0.625rem] text-body">Loading services...</p>
                    ) : null}

                    {services.length === 0 && !servicesQuery.isLoading && !servicesQuery.isError ? (
                        <p className="px-2 py-2 text-[0.625rem] text-body">No services available.</p>
                    ) : null}
                </div>
            ) : null}

            {servicesQuery.isError ? (
                <p className="mt-2 truncate text-[0.625rem] text-red-300">Could not load services.</p>
            ) : null}
        </div>
    );
};

export default ServiceDropDown;