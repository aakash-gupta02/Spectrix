import { DocsPageHeader } from "@/components/docs/DocsPageHeader";

export const metadata = {
  title: "Endpoints - Spectrix Documentation",
  description: "Learn how to configure monitoring for API endpoints in Spectrix.",
};

export default function EndpointsDocPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DocsPageHeader
        title="Endpoints"
        description="Define and track the exact routes of your application to gain granular insights, monitoring, and alerts."
      />

      <h2 className="text-2xl font-medium text-heading mb-6">How Endpoints Work</h2>
      <p className="mb-4 text-body">
        Once you have created a Service, you can attach <strong>Endpoints</strong> to it. An endpoint represents a specific path (like <code>/api/v1/checkout</code>) that you want Spectrix to monitor closely.
      </p>

      <ul className="list-disc pl-5 mt-4 space-y-2 text-body mb-8">
        <li><strong>Path-Based Tracking:</strong> By explicitly defining endpoints, you can track specific traffic routes and single out the performance of critical business logic.</li>
        <li><strong>Health Metrics:</strong> Each endpoint generates its own health metrics, including latency, error rates, and traffic volume.</li>
      </ul>

      <h3 className="text-xl font-medium text-heading mb-4">Adding Endpoints</h3>
      <p className="text-body mb-4">
        Within your Service view, you can click "Add Endpoint" to specify the exact route you want to track. Enter the relative path, and Spectrix will combine it with your Service's Base URL to start monitoring.
      </p>

    </div>
  );
}
