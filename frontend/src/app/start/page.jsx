import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Start",
  description: "Entry route that redirects authenticated users to their dashboard.",
  path: "/start",
  index: false,
  follow: false,
});

export default async function StartPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    redirect("/dashboard");
  }

  redirect("/login");
}
