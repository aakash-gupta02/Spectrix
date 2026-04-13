import { EndpointDocument } from "../endpoint/endpoint.model.js";
import { IncidentDocument } from "../incident/incident.model.js";

export function formatAlertMessage({
  type,
  endpoint,
  incident,
}: {
  type: string;
  endpoint?: EndpointDocument;
  incident?: IncidentDocument;
}) {
  const name = endpoint?.path || "Unknown endpoint";

  if (type === "incident_created") {
    return `🚨 API DOWN

Endpoint: ${name}
Status: DOWN
Time: ${new Date().toLocaleString()}

Reason: Multiple failures detected`;
  }

  if (type === "incident_resolved") {
    return `✅ API RECOVERED

Endpoint: ${name}
Recovered At: ${new Date().toLocaleString()}`;
  }

  return "Unknown alert";
}
