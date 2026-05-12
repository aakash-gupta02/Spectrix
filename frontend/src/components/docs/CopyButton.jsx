"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ text, className = "" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={`p-2 rounded-md hover:bg-white/10 transition-colors text-body hover:text-heading ${className}`}
      aria-label="Copy to clipboard"
    >
      {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
    </button>
  );
}
