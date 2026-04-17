import DashboardLayoutShell from "@/components/dashboard/layout/DashboardLayoutShell";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  return <DashboardLayoutShell>{children}</DashboardLayoutShell>;
}
