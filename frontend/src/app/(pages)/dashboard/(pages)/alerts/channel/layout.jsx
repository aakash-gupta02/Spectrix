import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Alert Channels",
  description: "Manage Slack, email, and webhook channels used for incident notifications.",
  path: "/dashboard/alerts/channel",
  index: false,
  follow: false,
});

export default function AlertChannelLayout({ children }) {
  return children;
}
