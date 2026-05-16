import { DocsPageHeader } from "@/components/docs/DocsPageHeader";

export const metadata = {
  title: "Services - Spectrix Documentation",
  description: "Learn about the base architecture and how Services work in Spectrix.",
};

export default function ServicesDocPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DocsPageHeader
        title="Services"
        description="The foundation of your monitoring architecture in Spectrix. A single service represents a specific piece of your infrastructure, like your core backend API, a microservice, or a frontend application."
      />

      <h2 className="text-2xl font-medium text-heading mb-6">Overview</h2>
      <p className="mb-4 text-body">
        In Spectrix, everything belongs to a <strong>Service</strong>. Before you can monitor endpoints, track metrics, or receive alerts, you must first register your service.
      </p>

      <ul className="list-disc pl-5 mt-4 space-y-2 text-body mb-8">
        <li><strong>Base URL:</strong> Each service requires a Base URL (e.g., <code>https://api.yourdomain.com</code>). This URL acts as the root for all endpoints attached to this service.</li>
        <li><strong>Service Types:</strong> You can create multiple services to represent a microservice architecture. E.g., <code>Auth Service</code>, <code>Payment Service</code>, <code>Main API</code>.</li>
      </ul>

      <h3 className="text-xl font-medium text-heading mb-4">Creating a Service</h3>
      <p className="text-body mb-4">
        To create a service, navigate to the Dashboard and click on &quot;Add Service&quot;. Provide a recognizable name and a valid Base URL. Once created, you are ready to start attaching Endpoints to it.
      </p>

    </div>
  );
}
