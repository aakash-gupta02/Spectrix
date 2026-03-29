"use client";

import { useService } from "@/contexts/ServiceContext";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const LocalServiceDropdown = ({
  value,
  onChange,
  disabled = false,
  label = "Service",
  includeAllOption = false,
  allOptionLabel = "All Services",
  allOptionValue = "all",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { services, servicesLoading, servicesError } = useService();
  const isAllSelected = includeAllOption && value === allOptionValue;

  const selectedService = useMemo(() => {
    if (!value || isAllSelected) return null;
    return services.find((service) => (service._id || service.id) === value) ?? null;
  }, [services, value, isAllSelected]);

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

  const displayName = isAllSelected
    ? allOptionLabel
    : selectedService?.name || "Select service";
  const displaySubtitle = isAllSelected
    ? "Across all services"
    : selectedService?.environment || selectedService?.baseUrl || "Click to select";

  return (
    <div ref={menuRef} className="relative">
      {label && (
        <label className="block text-xs uppercase tracking-[0.12em] text-muted mb-2">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={disabled || servicesLoading || servicesError || (!includeAllOption && services.length === 0)}
        className="flex w-full items-center justify-between rounded border border-border bg-surface-2 px-3 py-2 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/20 text-xs font-medium text-primary">
            {isAllSelected ? "A" : selectedService ? (selectedService.name || "S").charAt(0).toUpperCase() : "?"}
          </div>
          <div className="flex min-w-0 flex-col text-left">
            <span className="truncate text-sm text-heading">{displayName}</span>
            <span className="truncate text-[0.625rem] text-body">{displaySubtitle}</span>
          </div>
        </div>
        <ChevronDown size={14} className="shrink-0 text-body" />
      </button>

      {isOpen && (
        <div
          className="absolute top-full z-50 mt-2 max-h-48 w-full overflow-auto rounded border border-border bg-surface-2 p-1 shadow-lg"
          role="listbox"
        >
          {servicesLoading ? (
            <div className="px-2 py-2 text-[0.625rem] text-body">Loading services...</div>
          ) : servicesError ? (
            <div className="px-2 py-2 text-[0.625rem] text-red-300">Could not load services.</div>
          ) : services.length === 0 && !includeAllOption ? (
            <div className="px-2 py-2 text-[0.625rem] text-body">No services available.</div>
          ) : (
            <>
              {includeAllOption ? (
                <button
                  type="button"
                  onClick={() => {
                    onChange(allOptionValue);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded px-2 py-2 text-left text-xs transition-colors ${
                    isAllSelected
                      ? "bg-white/10 text-heading"
                      : "text-body hover:bg-white/5 hover:text-heading"
                  }`}
                  role="option"
                  aria-selected={isAllSelected}
                >
                  <span className="min-w-0 truncate">{allOptionLabel}</span>
                  <span className="ml-2 max-w-[45%] truncate text-[0.625rem] text-muted">all env</span>
                </button>
              ) : null}

              {services.map((service) => {
                const serviceId = service?._id || service?.id;
                if (!serviceId) return null;

                const isSelected = value === serviceId;

                return (
                  <button
                    key={serviceId}
                    type="button"
                    onClick={() => {
                      onChange(serviceId);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded px-2 py-2 text-left text-xs transition-colors ${
                      isSelected
                        ? "bg-white/10 text-heading"
                        : "text-body hover:bg-white/5 hover:text-heading"
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span className="min-w-0 truncate">{service?.name || "Unnamed service"}</span>
                    <span className="ml-2 max-w-[45%] truncate text-[0.625rem] text-muted">
                      {service?.environment || service?.baseUrl || "—"}
                    </span>
                  </button>
                );
              })}
            </>
          )}
        </div>
      )}

      {servicesError && !isOpen && (
        <p className="mt-1 text-[0.625rem] text-red-300">Could not load services.</p>
      )}
    </div>
  );
};

export default LocalServiceDropdown;
