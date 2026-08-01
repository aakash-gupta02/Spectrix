export default function StatusPageEmptyState() {
  return (
    <div className="overflow-hidden border border-dashed border-border bg-surface-1">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="text-sm uppercase tracking-[0.12em] text-heading">
          Status page
        </h2>
        <span className="text-[0.6875rem] text-body">Not configured</span>
      </div>

      <div className="px-5 py-8 text-sm text-body">
        No status page yet. Create your first status page above.
      </div>
    </div>
  );
}
