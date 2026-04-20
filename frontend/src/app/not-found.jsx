import Link from "next/link";
import { ArrowRight, Compass, Home, Layers3 } from "lucide-react";
import LandingButton from "@/components/ui/LandingButton";

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-screen items-center overflow-hidden bg-page px-4 py-10 text-heading sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 grid grid-cols-12 opacity-20">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="border-r border-border" />
        ))}
      </div>

      <section className="relative z-10 mx-auto w-full max-w-5xl">
        <div className="overflow-hidden border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] shadow-strong">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="border-b border-border p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="mb-8 flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.18em] text-muted">
                <span className="h-2 w-2 rounded-full bg-border" />
                Spectrix routing signal lost
              </div>

              <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded border border-border bg-black/30 px-6 py-12">
                <div className="absolute inset-x-6 top-8 border-t border-dashed border-white/5" />
                <div className="absolute inset-x-6 bottom-8 border-b border-dashed border-white/5" />

                <div className="relative text-center">
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1 text-[0.625rem] uppercase tracking-[0.16em] text-body">
                    <Compass size={12} />
                    404 not found
                  </div>

                  <h1 className="mt-6 text-6xl font-light tracking-tighter text-heading sm:text-7xl lg:text-[7.5rem]">
                    Lost.
                  </h1>

                  <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-body sm:text-base">
                    The page you requested does not exist, was moved, or is no longer available.
                    Return to the dashboard or head back to the homepage.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <LandingButton href="/dashboard" variant="primary">
                      Go to dashboard
                      <ArrowRight size={14} />
                    </LandingButton>

                    <LandingButton href="/" variant="ghost" className="bg-surface-1">
                      <Home size={14} />
                      Go home
                    </LandingButton>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-6 p-6 sm:p-8">
              <div>
                <div className="inline-flex items-center gap-2 border border-border bg-surface-2 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-muted">
                  Recovery options
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded border border-border bg-surface-1 p-4 transition-colors hover:bg-surface-2">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-border bg-surface-2 text-heading">
                        <Layers3 size={16} />
                      </div>
                      <div>
                        <h2 className="text-sm font-medium text-heading">Back to monitoring</h2>
                        <p className="mt-1 text-sm leading-relaxed text-body">
                          Open the dashboard to inspect services, APIs, incidents, and logs.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded border border-border bg-surface-1 p-4 transition-colors hover:bg-surface-2">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-border bg-surface-2 text-heading">
                        <Home size={16} />
                      </div>
                      <div>
                        <h2 className="text-sm font-medium text-heading">Return to landing</h2>
                        <p className="mt-1 text-sm leading-relaxed text-body">
                          Revisit the product overview and choose a different path into Spectrix.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded border border-border bg-surface-1 p-4">
                    <p className="text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                      Tip
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-body">
                      If you followed a broken link, use the browser back button or open the
                      dashboard directly to continue.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded border border-dashed border-border bg-black/20 p-4">
                <p className="text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                  Need a quick reset?
                </p>
                <p className="mt-2 text-sm text-body">
                  Jump back to the main experience and let the dashboard auth gate take over.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}