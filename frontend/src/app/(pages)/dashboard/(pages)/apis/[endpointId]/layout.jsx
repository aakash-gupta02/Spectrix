import { createPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }) {
  const { endpointId } = await params;

  return createPageMetadata({
    title: `Endpoint ${endpointId}`,
    description: "Inspect endpoint-level checks, failures, and response behavior.",
    path: `/dashboard/apis/${endpointId}`,
    index: false,
    follow: false,
  });
}

export default function EndpointLayout({ children }) {
  return children;
}
