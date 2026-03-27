"use client";

import DashboardNavbar from "@/components/dashboard/layout/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/layout/DashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const { isAuthenticated, isInitialized } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isInitialized) {
            return;
        }

        if (!isAuthenticated) {
            router.replace("/login");
        }
    }, [isAuthenticated, isInitialized, router]);

    if (!isInitialized || !isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-page">
                <p className="text-sm text-muted">Checking access...</p>
            </div>
        );
    }

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
