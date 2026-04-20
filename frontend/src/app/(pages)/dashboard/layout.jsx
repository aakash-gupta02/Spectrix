import DashboardAuthGate from "@/components/dashboard/layout/DashboardAuthGate";
import DashboardLayoutShell from "@/components/dashboard/layout/DashboardLayoutShell";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Dashboard",
  description: "Private Spectrix dashboard for API reliability operations.",
  path: "/dashboard",
  index: false,
  follow: false,
});

export default async function DashboardLayout({ children }) {
  return (
    <DashboardAuthGate>
      <DashboardLayoutShell>{children}</DashboardLayoutShell>
    </DashboardAuthGate>
  );
}
