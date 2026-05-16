import { DocsPageHeader } from "@/components/docs/DocsPageHeader";

export const metadata = {
  title: "Alert Channels - Spectrix Documentation",
  description: "Set up and configure incident notifications for your team in Spectrix.",
};

export default function AlertChannelsDocPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DocsPageHeader
        title="Alert Channels"
        description="Connect your critical monitoring infrastructure to the places where your team already collaborates."
      />

      <h2 className="text-2xl font-medium text-heading mb-6">Never Miss a Failure</h2>
      <p className="mb-6 text-body">
        Spectrix constantly monitors your services and endpoints. Whenever a threshold is breached, an endpoint goes down, or error rates spike, an Incident is created. Alert Channels ensure your engineers are notified immediately.
      </p>

      <ul className="list-disc pl-5 mt-4 space-y-4 text-body mb-8">
        <li>
          <strong>Slack & Discord:</strong> Connect your workspaces directly. Spectrix provides automated, rich notifications to dedicated channels, giving engineers immediate context to acknowledge and resolve issues.
        </li>
        <li>
          <strong>Webhooks:</strong> Build custom integrations by sending JSON payloads to any HTTPS endpoint as soon as an alert fires.
        </li>
      </ul>

      <h3 className="text-xl font-medium text-heading mb-4">Setting up a Channel</h3>
      <p className="text-body mb-4">
        Go to the <strong>Alert Channels</strong> section in your Dashboard. Choose your provider (Slack, Discord, or generic Webhook) and paste the incoming Webhook URL provided by those services. Map them to specific alerts, and you're good to go.
      </p>

    </div>
  );
}
