import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <CopyButton text={code} className="bg-surface-3 border border-border" />
        </div>
      )}
      <SyntaxHighlighter 
        language={language} 
        style={vscDarkPlus}
        customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
        className="text-sm font-mono text-heading"
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
