import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Services",
  description: "Manage monitored services and reliability ownership in Spectrix.",
  path: "/dashboard/services",
  index: false,
  follow: false,
});

export default function ServicesLayout({ children }) {
  return children;
}
