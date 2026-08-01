import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Status Page",
  description: "Manage the workspace status page settings and customer-facing URL.",
  path: "/dashboard/status-page",
  index: false,
  follow: false,
});

export default function StatusPageLayout({ children }) {
  return children;
}