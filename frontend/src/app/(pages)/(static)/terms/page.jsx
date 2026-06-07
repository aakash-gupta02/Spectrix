import Navbar from "@/components/landingPage/Navbar";
import Footer from "@/components/landingPage/Footer";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Terms of Service",
  description: "Spectrix terms of service for visitors and users of the public website.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-page text-body">
      <Navbar />

      <section className="border-b border-dashed border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-primary">Legal</p>
          <h1 className="text-4xl font-light tracking-tighter text-heading sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-6 text-base leading-relaxed text-body-strong sm:text-lg">
            These terms describe the basic rules for using the Spectrix public website. This is a
            learning project, so the wording is intentionally short and simple.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-4xl gap-8 px-6">
          <article className="border border-border bg-surface-1 p-6 sm:p-8">
            <h2 className="text-xl font-medium text-heading">Acceptable use</h2>
            <p className="mt-3 text-sm leading-relaxed text-body">
              Please use the site responsibly and do not try to break, overload, or misuse the service.
            </p>
          </article>

          <article className="border border-border bg-surface-1 p-6 sm:p-8">
            <h2 className="text-xl font-medium text-heading">Content ownership</h2>
            <p className="mt-3 text-sm leading-relaxed text-body">
              The Spectrix name, branding, and page content belong to the project owner unless stated
              otherwise.
            </p>
          </article>

          <article className="border border-border bg-surface-1 p-6 sm:p-8">
            <h2 className="text-xl font-medium text-heading">Changes</h2>
            <p className="mt-3 text-sm leading-relaxed text-body">
              These terms may be updated at any time as the project evolves.
            </p>
          </article>
        </div>
      </section>

      <Footer />
    </main>
  );
}