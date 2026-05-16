import { DocsPageHeader } from "@/components/docs/DocsPageHeader";

export const metadata = {
  title: "Dashboard Monitoring - Spectrix Documentation",
  description: "Learn how to use the Spectrix dashboard to monitor incidents, metrics, and logs.",
};

export default function DashboardMonitoringDocPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DocsPageHeader
        title="Dashboard Monitoring"
        description="Understand how to process and interpret the data, logs, and incidents shown in your Spectrix Platform interface."
      />

      <h2 className="text-2xl font-medium text-heading mb-6">Real-time Visibility</h2>
      <p className="mb-4 text-body">
        The Dashboard is your central command center. Here you can view high-level metrics across all services, or dive deep into the performance of a single endpoint.
      </p>

      <div className="space-y-8 mt-6">
        <div>
          <h3 className="text-xl font-medium text-heading mb-2">Metrics Overview</h3>
          <p className="text-body">
            View aggregated statistics across your infrastructure, including global Uptime, P99 Server Latency, and Error rates. These metrics are updated in real-time.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-medium text-heading mb-2">Logs & Streams</h3>
          <p className="text-body">
            Inspect raw event data and structured logs as they happen. The stream view allows for heavily localized debugging when you trace down abnormal behavior in your infrastructure.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-medium text-heading mb-2">Incident Management</h3>
          <p className="text-body">
            When automated rules are breached, an Incident appears in your platform. The incident page provides comprehensive details about the failure, allowing team members to acknowledge it, investigate the correlating logs, and mark it resolved.
          </p>
        </div>
      </div>
    </div>
  );
}
