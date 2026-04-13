import { sendSlack } from "./channels/slack.js";
import { sendDiscord } from "./channels/discord.js";
import { formatAlertMessage } from "./alert.formatter.js";
import { EndpointDocument } from "../endpoint/endpoint.model.js";
import { IncidentDocument } from "../incident/incident.model.js";

export async function triggerAlert({
  type,
  endpoint,
  incident,
}: {
  type: "incident_created" | "incident_resolved";
  endpoint: EndpointDocument;
  incident: IncidentDocument;
}) {
  try {
    const message = formatAlertMessage({ type, endpoint, incident });

    await Promise.all([sendSlack(message), sendDiscord(message)]);
  } catch (err) {
    console.error("[ALERT ERROR]", err);
  }
}
