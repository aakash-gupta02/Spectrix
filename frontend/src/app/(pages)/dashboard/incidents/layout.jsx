import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Incidents",
  description: "Review active and historical incidents impacting monitored APIs.",
  path: "/dashboard/incidents",
  index: false,
  follow: false,
});

export default function IncidentsLayout({ children }) {
  return children;
}
