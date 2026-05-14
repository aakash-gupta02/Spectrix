"use client";

import { useState } from "react";
import { CopyButton } from "./CopyButton";

export function CodeTabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);
  const activeCode = tabs[activeTab].code;
  const activeLanguage = tabs[activeTab].language || "javascript";

  return (
    <div className="relative my-4 rounded-lg bg-surface-2 border border-border overflow-hidden">
      <div className="flex items-center justify-between px-2 pt-2 border-b border-border bg-surface-3">
        <div className="flex space-x-2">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-3 py-1.5 text-xs font-mono rounded-t-md transition-colors ${
                activeTab === index
                  ? "bg-surface-2 text-heading border-t border-l border-r border-border"
                  : "bg-surface-3 text-body hover:text-heading"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
        <div className="pb-2 pr-2">
          <CopyButton text={activeCode} className="p-1" />
        </div>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono text-heading">
        <code className={`language-${activeLanguage}`}>{activeCode}</code>
      </pre>
    </div>
  );
}