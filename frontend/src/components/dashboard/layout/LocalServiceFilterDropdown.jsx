"use client";

import { useService } from "@/contexts/ServiceContext";
import { ChevronDown, Filter } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const LocalServiceFilterDropdown = ({
  value,
  onChange,
  allOptionLabel = "All Services",
  allOptionValue = "all",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { services, servicesLoading, servicesError } = useService();

  const isAllSelected = value === allOptionValue;

  const selectedService = useMemo(() => {
    if (!value || isAllSelected) {
      return null;
    }

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

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={servicesLoading || servicesError}
        className="inline-flex h-9 min-w-48 items-center justify-between gap-2 rounded border border-border bg-surface-2 px-3 text-xs text-body transition-colors hover:border-primary/40 hover:bg-primary-soft hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="inline-flex min-w-0 items-center gap-2">
          <Filter size={12} />
          <span className="truncate">{displayName}</span>
        </span>
        <ChevronDown size={14} className="shrink-0" />
      </button>

      {isOpen ? (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-64 max-h-56 overflow-auto rounded border border-border bg-surface-2 p-1 shadow-lg"
          role="listbox"
        >
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
            <span className="truncate">{allOptionLabel}</span>
            <span className="ml-2 shrink-0 text-[0.625rem] text-muted">all env</span>
          </button>

          {servicesLoading ? (
            <div className="px-2 py-2 text-[0.625rem] text-body">Loading services...</div>
          ) : servicesError ? (
            <div className="px-2 py-2 text-[0.625rem] text-red-300">Could not load services.</div>
          ) : services.length === 0 ? (
            <div className="px-2 py-2 text-[0.625rem] text-body">No services available.</div>
          ) : (
            services.map((service) => {
              const serviceId = service?._id || service?.id;
              if (!serviceId) {
                return null;
              }

              const isSelected = value === serviceId;

              return (
                <button
                  key={serviceId}
                  type="button"
                  onClick={() => {
                    onChange(serviceId);
                    setIsOpen(false);
                  }}
                  className={`mt-1 flex w-full items-center justify-between rounded px-2 py-2 text-left text-xs transition-colors ${
                    isSelected
                      ? "bg-white/10 text-heading"
                      : "text-body hover:bg-white/5 hover:text-heading"
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="min-w-0 truncate">{service?.name || "Unnamed service"}</span>
                  <span className="ml-2 max-w-[45%] truncate text-[0.625rem] text-muted">
                    {service?.environment || service?.baseUrl || "-"}
                  </span>
                </button>
              );
            })
          )}
        </div>
      ) : null}
    </div>
  );
};

export default LocalServiceFilterDropdown;
