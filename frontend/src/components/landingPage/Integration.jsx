"use client";
import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import SectionHeading from "../common/SectionHeading";

export default function Integration() {
  const [copied, setCopied] = useState(null);

  const codeExamples = [
    {
      title: "Basic Setup",
      language: "javascript",
      code: `import { Spectrix } from '@spectrix/sdk';\n\nconst client = new Spectrix({\n  apiKey: 'your-api-key',\n  baseURL: 'https://api.spectrix.io'\n});`,
    },
    {
      title: "Monitor Endpoint",
      language: "javascript",
      code: `const response = await client.get('/users', {\n  monitor: true,\n  timeout: 5000\n});\n\nconsole.log(response.metrics);`,
    },
    {
      title: "Error Tracking",
      language: "javascript",
      code: `client.on('error', (error) => {\n  console.error('API Error:', error);\n  // Send to monitoring dashboard\n  trackError(error);\n});`,
    },
    {
      title: "Custom Analytics",
      language: "javascript",
      code: `const metrics = await client.analytics({\n  startDate: '2024-01-01',\n  endDate: '2024-12-31',\n  groupBy: 'endpoint'\n});`,
    },
  ];

  const handleCopy = (index, code) => {
    navigator.clipboard.writeText(code);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="border-b border-dashed border-white/10 bg-page py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="03. Quick Integration"
          title="Copy, paste, monitor."
          buttonTxt="View Docs"
          description="Ready-to-use code snippets to integrate Spectrix into your application in minutes."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {codeExamples.map((example, idx) => (
            <div
              key={idx}
              className="border border-dashed border-white/10 hover:border-white/20 transition-colors group overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-dashed border-white/10 p-4">
                <h3 className="font-mono text-sm font-medium text-white">
                  {example.title}
                </h3>
                <button
                  onClick={() => handleCopy(idx, example.code)}
                  className="flex items-center gap-2 rounded bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {copied === idx ? (
                    <>
                      <Check size={14} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <div className="overflow-auto bg-slate-950/50 p-4">
                <pre className="font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap wrap-break-word">
                  <code>{example.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
