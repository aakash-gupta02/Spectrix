export default function DashboardAuthSkeleton() {
  return (
    <div
      aria-busy="true"
      className="flex h-screen min-h-0 flex-col overflow-hidden bg-page text-body"
    >
      <header className="sticky top-0 z-50 border-b border-dashed border-border bg-black/90 backdrop-blur-md">
        <div className="flex h-14 sm:h-16">
          <div className="flex min-w-0 flex-1 items-center border-r border-dashed border-border px-4 md:w-64 md:flex-none sm:px-6">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 animate-pulse rounded-sm bg-white/10" />
              <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
            </div>
          </div>

          <div className="hidden flex-1 items-center border-r border-dashed border-border px-4 md:flex">
            <div className="h-3 w-56 animate-pulse rounded-full bg-white/10" />
          </div>

          <div className="flex shrink-0 items-center justify-end gap-2 px-3 sm:px-6">
            <div className="h-8 w-20 animate-pulse rounded border border-border bg-white/5" />
            <div className="h-8 w-8 animate-pulse rounded border border-border bg-white/5" />
            <div className="h-8 w-8 animate-pulse rounded border border-border bg-white/5 md:hidden" />
            <div className="mx-1 hidden h-8 w-px bg-border md:block" />
            <div className="hidden items-center gap-2 rounded border border-border bg-white/5 px-2 py-1.5 lg:flex">
              <div className="h-6 w-6 animate-pulse rounded-full bg-white/10" />
              <div className="flex flex-col gap-1">
                <div className="h-2.5 w-20 animate-pulse rounded-full bg-white/10" />
                <div className="h-2 w-14 animate-pulse rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-64 border-r border-dashed border-border bg-page md:block">
          <div className="border-b border-dashed border-border px-4 py-4">
            <div className="h-10 animate-pulse rounded border border-border bg-white/5" />
          </div>

          <div className="space-y-3 px-3 py-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-9 animate-pulse rounded border border-border bg-white/5" />
            ))}
          </div>

          <div className="border-t border-dashed border-border px-3 py-3">
            <div className="h-4 animate-pulse rounded-full bg-white/5" />
          </div>
        </aside>

        <main className="no-scrollbar min-w-0 flex-1 overflow-y-auto">
          <section className="w-full px-4 pb-10 pt-8 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-6xl space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="h-3 w-20 animate-pulse rounded-full bg-white/10" />
                  <div className="h-8 w-56 animate-pulse rounded-full bg-white/10" />
                  <div className="h-4 w-96 max-w-full animate-pulse rounded-full bg-white/10" />
                </div>

                <div className="h-10 w-32 animate-pulse rounded border border-border bg-white/5" />
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="h-8 w-24 animate-pulse rounded border border-border bg-white/5" />
                <div className="h-8 w-36 animate-pulse rounded border border-border bg-white/5" />
                <div className="h-8 w-28 animate-pulse rounded border border-border bg-white/5" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="rounded border border-border bg-surface-1 p-5">
                    <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
                    <div className="mt-4 h-8 w-28 animate-pulse rounded-full bg-white/10" />
                    <div className="mt-3 h-3 w-32 animate-pulse rounded-full bg-white/10" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="rounded border border-border bg-surface-1 p-5 lg:col-span-2">
                  <div className="h-4 w-28 animate-pulse rounded-full bg-white/10" />
                  <div className="mt-3 h-3 w-80 max-w-full animate-pulse rounded-full bg-white/10" />
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {[...Array(2)].map((_, index) => (
                      <div key={index} className="rounded border border-border bg-surface-2 p-4">
                        <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
                        <div className="mt-4 h-8 w-24 animate-pulse rounded-full bg-white/10" />
                        <div className="mt-4 h-2 w-full animate-pulse rounded-full bg-white/10" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded border border-border bg-surface-1 p-5">
                  <div className="h-4 w-32 animate-pulse rounded-full bg-white/10" />
                  <div className="mt-3 h-3 w-48 max-w-full animate-pulse rounded-full bg-white/10" />
                  <div className="mt-6 space-y-3">
                    {[...Array(4)].map((_, index) => (
                      <div key={index} className="h-4 w-full animate-pulse rounded-full bg-white/10" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}