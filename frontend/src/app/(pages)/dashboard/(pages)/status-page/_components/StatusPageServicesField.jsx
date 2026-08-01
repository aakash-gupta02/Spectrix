import { GripVertical } from "lucide-react";

function getServiceId(service) {
  return service?._id || service?.id || service?.serviceId || "";
}

export default function StatusPageServicesField({
  services = [],
  selectedServiceIds = [],
  onChange,
}) {
  const toggleService = (serviceId) => {
    if (!serviceId) return;

    const next = selectedServiceIds.includes(serviceId)
      ? selectedServiceIds.filter((id) => id !== serviceId)
      : [...selectedServiceIds, serviceId];

    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {selectedServiceIds.length ? (
          selectedServiceIds.map((serviceId, index) => {
            const service = services.find((item) => getServiceId(item) === serviceId);

            return (
              <div
                key={serviceId}
                className="flex items-center justify-between border border-border bg-surface-2 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="cursor-grab p-1 text-body hover:bg-white/5"
                    aria-label={`Drag ${service?.name || "service"}`}
                  >
                    <GripVertical size={14} />
                  </button>
                  <div>
                    <p className="text-sm text-heading">{service?.name || "Selected service"}</p>
                    <p className="text-[0.6875rem] text-body">Order {index + 1}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleService(serviceId)}
                  className="text-[0.6875rem] text-body hover:text-heading"
                >
                  Remove
                </button>
              </div>
            );
          })
        ) : (
          <div className="border border-dashed border-border px-3 py-4 text-sm text-body">
            No services selected yet.
          </div>
        )}
      </div>

      <div className="border border-border bg-surface-2">
        <div className="border-b border-border px-3 py-2">
          <p className="text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
            Available services
          </p>
        </div>
        <div className="space-y-1 p-2">
          {services.map((service) => {
            const serviceId = getServiceId(service);
            const isSelected = selectedServiceIds.includes(serviceId);

            return (
              <label
                key={serviceId}
                className="flex cursor-pointer items-center justify-between border border-transparent px-3 py-2 text-sm text-body hover:border-border hover:bg-white/5"
              >
                <span>{service?.name || "Unnamed service"}</span>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleService(serviceId)}
                  className="h-4 w-4 border-border bg-transparent"
                />
              </label>
            );
          })}

          {!services.length ? (
            <p className="px-3 py-2 text-sm text-body">
              No services available in this workspace.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
