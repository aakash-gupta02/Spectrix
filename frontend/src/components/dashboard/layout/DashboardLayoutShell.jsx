"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard/layout/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/layout/DashboardSidebar";

export default function DashboardLayoutShell({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-page text-body">
      <DashboardNavbar onMenuToggle={() => setIsSidebarOpen((prev) => !prev)} />

      <div className="flex min-h-0 flex-1">
        <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="no-scrollbar relative min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
