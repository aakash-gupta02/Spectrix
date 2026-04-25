import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Alerts",
  description: "Configure alerting behavior and monitor active reliability signals.",
  path: "/dashboard/alerts",
  index: false,
  follow: false,
});

export default function AlertsLayout({ children }) {
  return children;
}
