import { Cat, GitBranch, GitFork } from "lucide-react";

export function DocsFooter() {
  return (
    <div className="mt-16 pt-8 border-t border-dashed border-border mb-8">
      <div className="p-6 bg-surface-2 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium text-heading mb-1">Need help or found a bug?</h3>
          <p className="text-body text-sm">
            Spectrix is open source. Reach out to us by opening an issue on GitHub.
          </p>
        </div>
        <a
          href="https://github.com/aakash-gupta02/Spectrix/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center justify-center gap-2 bg-primary px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-primary-strong shrink-0"
        >
          <Cat size={16} />
          <span>Open GitHub Issue</span>
        </a>
      </div>
    </div>
  );
}
