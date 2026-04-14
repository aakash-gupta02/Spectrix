import { IncidentDocument } from "../incident/incident.model.js";
import type { EndpointEntity } from "../endpoint/endpoint.model.js";
import type { ServiceEntity } from "../service/service.model.js";

export type EndpointWithService = Omit<EndpointEntity, "serviceId"> & {
  serviceId: ServiceEntity;
};

function formatDuration(ms: number) {
  const seconds = Math.floor(ms / 1000);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""}`;

  return `${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""}`;
}

export function formatAlertMessage({
  type,
  endpoint,
  incident,
}: {
  type: string;
  endpoint?: EndpointWithService;
  incident?: IncidentDocument;
}) {
  const name = endpoint?.name || "Unknown endpoint";

  if (type === "incident_created") {
    return `🚨 API DOWN

Service: ${endpoint?.serviceId?.name || "Unknown service"}, Environment: ${endpoint?.serviceId?.environment || "Unknown environment"}


Endpoint: ${name}
Method: ${endpoint?.method || "Unknown method"}, Path: ${endpoint?.path || "Unknown path"}

Status: DOWN
Time: ${new Date().toLocaleString()}

Reason: ${incident?.failureCount || 3} consecutive failures

`;
  }

  if (type === "incident_resolved") {
    return `✅ API RECOVERED

Service: ${endpoint?.serviceId?.name || "Unknown service"}, Environment: ${endpoint?.serviceId?.environment || "Unknown environment"}


Endpoint: ${name}
Method: ${endpoint?.method || "Unknown method"}, Path: ${endpoint?.path || "Unknown path"}

Recovered At: ${new Date().toLocaleString()}

Downtime Duration: ${
      incident && incident.resolvedAt && incident.startedAt
        ? formatDuration(
            new Date(incident.resolvedAt).getTime() -
              new Date(incident.startedAt).getTime(),
          )
        : "Unknown"
    } 
`;
  }

  return "Unknown alert";
}
