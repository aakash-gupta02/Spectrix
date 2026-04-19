import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Login",
  description: "Sign in to Spectrix and access your API monitoring workspace.",
  path: "/login",
  index: false,
  follow: false,
});

export default function LoginLayout({ children }) {
  return children;
}
