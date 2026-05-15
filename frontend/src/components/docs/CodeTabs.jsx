"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "./CopyButton";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ChevronDown, ChevronUp } from "lucide-react";

const COLLAPSED_LINES = 14;

export function CodeTabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const activeCode = tabs[activeTab].code;

  const activeLanguage = tabs[activeTab].language || "javascript";

  const lineCount = useMemo(() => activeCode.split("\n").length, [activeCode]);

  const shouldCollapse = lineCount > COLLAPSED_LINES;

  return (
    <div className="relative my-4 overflow-hidden rounded-lg border border-border bg-surface-2">
      {/* tabs */}
      <div className="flex items-center justify-between border-b border-border bg-surface-3 px-2 pt-2">
        <div className="flex space-x-2">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveTab(index);
                setExpanded(false);
              }}
              className={`rounded-t-md px-3 py-1.5 font-mono text-xs transition-colors ${
                activeTab === index
                  ? "border border-b-0 border-border bg-surface-2 text-heading"
                  : "bg-surface-3 text-body hover:text-heading"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <div className="pb-2 pr-2">
          <CopyButton text={activeCode} className="relative z-10 p-1" />
        </div>
      </div>

      {/* code wrapper */}
      <div className="relative">
        <div
          className={`overflow-hidden transition-all duration-300 ${
            !expanded && shouldCollapse ? "max-h-[320px]" : "max-h-[4000px]"
          }`}
        >
          <SyntaxHighlighter
            language={activeLanguage}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: "1rem",
              background: "transparent",
            }}
            className="font-mono text-sm text-heading"
          >
            {activeCode}
          </SyntaxHighlighter>
        </div>

        {/* fade overlay */}
        {!expanded && shouldCollapse ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface-2 to-transparent" />
        ) : null}
      </div>

      {/* expand button */}
      {shouldCollapse ? (
        <div className="flex justify-center border-t border-border bg-surface-3 px-4 py-3">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex items-center gap-2 text-sm text-body transition-colors hover:text-heading"
          >
            {expanded ? (
              <>
                <ChevronUp size={16} />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                Show Full Code
              </>
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}
