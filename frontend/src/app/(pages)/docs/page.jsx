import { StepSection } from "@/components/docs/StepSection";
import { DocsPageHeader } from "@/components/docs/DocsPageHeader";

export const metadata = {
  title: "Documentation - Spectrix",
  description: "Learn how to integrate and use Spectrix in your applications.",
};

export default function DocsPage() {
  const steps = [
    {
      title: "Add Your Service",
      content: (
        <>
          <p className="text-body mb-4">
            Start by defining your target service in Spectrix. This acts as the
            root configuration for a specific application.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-body">
            <li>
              <strong>Service Name:</strong> A unique recognizable identifier
              for your application.
            </li>
            <li>
              <strong>Base URL:</strong> The root URL where your service is
              hosted.
            </li>
            <li>
              <strong>Representation:</strong> Think of a service as your core
              backend, microservice, or main app instance.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Add API Endpoints",
      content: (
        <>
          <p className="text-body mb-4">
            Once your service is created, attach specific endpoints that you
            want to monitor closely.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-body">
            <li>
              <strong>Monitoring Routes:</strong> Define the exact paths (e.g.,{" "}
              <code>/api/v1/checkout</code>) you want tracked.
            </li>
            <li>
              <strong>Path-based Tracking:</strong> Gain granular insights into
              response times, error rates, and traffic per route.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Connect Alert Channels",
      content: (
        <>
          <p className="text-body mb-4">
            Ensure you never miss a critical failure by integrating with your
            team`&apos;`s communication tools.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-body">
            <li>
              <strong>Integrations:</strong> Send automated alerts via Slack,
              Discord, or Custom Webhooks.
            </li>
            <li>
              <strong>Incident Notifications:</strong> Get instantly alerted
              when an endpoint acts up, breaches latency limits, or goes down.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Monitor and Respond",
      content: (
        <>
          <p className="text-body mb-4">
            Use the Spectrix platform to keep a constant pulse on your entire
            infrastructure.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-body">
            <li>
              <strong>Dashboard Monitoring:</strong> Visualize your health
              metrics and uptime in real-time.
            </li>
            <li>
              <strong>Logs & Streams:</strong> Inspect structured logs and live
              request streams for quick debugging.
            </li>
            <li>
              <strong>Realtime Alerts & Incidents:</strong> View, acknowledge,
              and resolve ongoing incidents quickly.
            </li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DocsPageHeader
        title="Introduction"
        description="Welcome to the Spectrix documentation. Learn how to quickly set up your monitoring infrastructure to track your applications and receive critical alerts anytime an issue arises."
      />

      <h2 className="text-2xl font-medium text-heading mb-6">How It Works</h2>
      <p className="mb-6 text-body">
        Spectrix operates heavily on a streamlined configuration structure for
        ease of use. Follow these core workflow steps to get everything running
        in minutes.
      </p>

      <StepSection steps={steps} />
    </div>
  );
}
