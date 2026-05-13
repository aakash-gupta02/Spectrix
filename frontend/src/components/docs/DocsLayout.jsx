"use client";

import { useState } from "react";
import { DocsSidebar } from "./DocsSidebar";
import { DocsNavbar } from "./DocsNavbar";
import { DocsFooter } from "./DocsFooter";

export function DocsLayoutShell({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-page text-body">
      <DocsNavbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex min-h-0 flex-1">
        <DocsSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="no-scrollbar relative min-w-0 flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col min-h-full">
            <div className="flex-1">
              {children}
            </div>
            <DocsFooter />
          </div>
        </main>
      </div>
    </div>
  );
}
