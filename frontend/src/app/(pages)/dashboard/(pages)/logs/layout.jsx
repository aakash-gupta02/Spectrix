import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Logs",
  description: "Analyze request history, errors, and latency trends from monitoring logs.",
  path: "/dashboard/logs",
  index: false,
  follow: false,
});

export default function LogsLayout({ children }) {
  return children;
}
