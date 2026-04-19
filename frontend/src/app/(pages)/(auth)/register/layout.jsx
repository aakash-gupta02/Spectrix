import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Register",
  description: "Create a Spectrix account to start monitoring API reliability and uptime.",
  path: "/register",
  index: false,
  follow: false,
});

export default function RegisterLayout({ children }) {
  return children;
}
