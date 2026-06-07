import Navbar from "@/components/landingPage/Navbar";
import Footer from "@/components/landingPage/Footer";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "Spectrix privacy policy for visitors and users of the public website.",
  path: "/Privacy",
});

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-page text-body">
      <Navbar />

      <section className="border-b border-dashed border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-primary">Legal</p>
          <h1 className="text-4xl font-light tracking-tighter text-heading sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-6 text-base leading-relaxed text-body-strong sm:text-lg">
            This page explains how Spectrix handles information on the public website. It is a basic
            project version, so the policy is intentionally simple.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-4xl gap-8 px-6">
          <article className="border border-border bg-surface-1 p-6 sm:p-8">
            <h2 className="text-xl font-medium text-heading">What we collect</h2>
            <p className="mt-3 text-sm leading-relaxed text-body">
              We may collect basic technical information such as browser type, device information,
              and page usage to help understand how the site is used.
            </p>
          </article>

          <article className="border border-border bg-surface-1 p-6 sm:p-8">
            <h2 className="text-xl font-medium text-heading">How we use it</h2>
            <p className="mt-3 text-sm leading-relaxed text-body">
              Information is used to keep the site working, improve the experience, and understand
              what content is useful to visitors.
            </p>
          </article>

          <article className="border border-border bg-surface-1 p-6 sm:p-8">
            <h2 className="text-xl font-medium text-heading">Contact</h2>
            <p className="mt-3 text-sm leading-relaxed text-body">
              If you have questions about this policy, reach out through the contact link in the footer.
            </p>
          </article>
        </div>
      </section>

      <Footer />
    </main>
  );
}