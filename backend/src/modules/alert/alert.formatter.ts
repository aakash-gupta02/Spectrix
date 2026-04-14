import { IncidentDocument } from "../incident/incident.model.js";
import type { EndpointEntity } from "../endpoint/endpoint.model.js";
import type { ServiceEntity } from "../service/service.model.js";

export type EndpointWithService = Omit<EndpointEntity, "serviceId"> & {
  serviceId: ServiceEntity;
};

export function formatAlertMessage({
  type,
  endpoint,
  incident,
}: {
  type: string;
  endpoint?: EndpointWithService;
  incident?: IncidentDocument;
}) {
  const name = endpoint?.path || "Unknown endpoint";

  if (type === "incident_created") {
    return `🚨 API DOWN

Service: ${endpoint?.serviceId?.name || "Unknown service"}
Environment: ${endpoint?.serviceId?.environment || "Unknown environment"}
Base Url: ${endpoint?.serviceId?.baseUrl || "Unknown base URL"}


Endpoint: ${name}
Path: ${endpoint?.path || "Unknown path"}

Status: DOWN
Time: ${new Date().toLocaleString()}

Reason: Multiple failures detected`;
  }

  if (type === "incident_resolved") {
    return `✅ API RECOVERED

Service: ${endpoint?.serviceId?.name || "Unknown service"}
Environment: ${endpoint?.serviceId?.environment || "Unknown environment"}
Base Url: ${endpoint?.serviceId?.baseUrl || "Unknown base URL"}

Endpoint: ${name}
Path: ${endpoint?.path || "Unknown path"}
Recovered At: ${new Date().toLocaleString()}`;
  }

  return "Unknown alert";
}
