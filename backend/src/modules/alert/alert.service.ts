import { sendSlack } from "./channels/slack.js";
import { sendDiscord } from "./channels/discord.js";
import { EndpointWithService, formatAlertMessage } from "./alert.formatter.js";
import { EndpointDocument } from "../endpoint/endpoint.model.js";
import { IncidentDocument } from "../incident/incident.model.js";
import sendWebhook from "./channels/webhook.js";

export async function triggerAlert({
  type,
  endpoint,
  incident,
}: {
  type: "incident_created" | "incident_resolved";
  endpoint: EndpointWithService;
  incident?: IncidentDocument;
}) {
  try {
    const message = formatAlertMessage({ type, endpoint, incident });

    // await Promise.all([sendSlack(message), sendDiscord(message)]);
  } catch (err) {
    console.error("[ALERT ERROR]", err);
  }
}

export async function sendByType(params: {
  type: string;
  url: string;
  message: string;
}) {
  const { type, url, message } = params;
  if (type === "slack") return sendSlack(url, message);
  if (type === "discord") return sendDiscord(url, message);
  return sendWebhook(url, message);
}
