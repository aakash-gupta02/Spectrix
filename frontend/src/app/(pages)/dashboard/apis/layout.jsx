import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "APIs",
  description: "Track endpoint reliability, latency, and error behavior across your API surface.",
  path: "/dashboard/apis",
  index: false,
  follow: false,
});

export default function ApisLayout({ children }) {
  return children;
}
