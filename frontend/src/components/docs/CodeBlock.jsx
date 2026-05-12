import { CopyButton } from "./CopyButton";

export function CodeBlock({ code, language = "javascript", title }) {
  return (
    <div className="relative my-4 rounded-lg bg-surface-2 border border-border overflow-hidden group">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-3">
          <span className="text-xs font-mono text-body">{title}</span>
          <CopyButton text={code} className="p-1" />
        </div>
      )}
      {!title && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton text={code} className="bg-surface-3 border border-border" />
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-sm font-mono text-heading">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
