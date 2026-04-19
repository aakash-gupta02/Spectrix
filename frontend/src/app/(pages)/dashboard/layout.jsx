import DashboardLayoutShell from "@/components/dashboard/layout/DashboardLayoutShell";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Dashboard",
  description: "Private Spectrix dashboard for API reliability operations.",
  path: "/dashboard",
  index: false,
  follow: false,
});

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  return <DashboardLayoutShell>{children}</DashboardLayoutShell>;
}
