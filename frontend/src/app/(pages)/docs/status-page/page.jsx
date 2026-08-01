import { DocsPageHeader } from "@/components/docs/DocsPageHeader";
import Link from "next/link";

export const metadata = {
  title: "Status Page - Spectrix Documentation",
  description:
    "Create and manage a public status page for your customers with Spectrix.",
};

export default function StatusPageDocPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DocsPageHeader
        title="Status Page"
        description="Share real-time service health with your customers through a branded public status page."
      />

      <h2 className="text-2xl font-medium text-heading mb-6">Overview</h2>
      <p className="mb-6 text-body">
        A Spectrix status page turns your monitored services into a customer-facing
        view of uptime, current health, and recent incidents. Each workspace can
        configure one status page and choose which services appear on it.
      </p>

      <ul className="mb-8 list-disc space-y-3 pl-5 text-body">
        <li>
          <strong>Branding:</strong> Set a name, description, and logo so the page
          matches your product.
        </li>
        <li>
          <strong>Slug:</strong> Your public URL is based on a unique slug, for
          example <code>/status/your-slug</code>.
        </li>
        <li>
          <strong>Visibility:</strong> Keep the page public for customers, or
          private while you are still setting it up.
        </li>
        <li>
          <strong>Services:</strong> Select which services should appear on the
          public page. Only selected services are shown.
        </li>
      </ul>

      <h3 className="mb-4 text-xl font-medium text-heading">Creating a status page</h3>
      <p className="mb-4 text-body">
        Open{" "}
        <Link
          href="/dashboard/status-page"
          className="text-primary underline-offset-2 hover:underline"
        >
          Status Page
        </Link>{" "}
        in your dashboard and click <strong>Create Status Page</strong>. Add a
        name, optional description and logo, choose visibility, then select the
        services to include.
      </p>
      <p className="mb-8 text-body">
        After creation, you can update the slug, branding, visibility, and
        service list at any time. Use the public URL from the settings screen to
        share the page with customers.
      </p>

      <h3 className="mb-4 text-xl font-medium text-heading">What customers see</h3>
      <p className="mb-4 text-body">
        The public page shows overall status, per-service health, recent uptime
        history, and active or recent incidents for the services you selected.
        It refreshes automatically so visitors always see current availability.
      </p>
    </div>
  );
}
