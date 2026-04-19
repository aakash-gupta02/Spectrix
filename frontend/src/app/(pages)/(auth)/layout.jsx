import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Authentication",
  description: "Sign in or create an account to access the Spectrix monitoring dashboard.",
  path: "/login",
  index: false,
  follow: false,
});

export default function AuthLayout({ children }) {
  return children;
}
