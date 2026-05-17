import React from "react";
import Link from "next/link";
import Navbar from "@/components/landingPage/Navbar";
import Footer from "@/components/landingPage/Footer";
import { createPageMetadata, siteConfig, getSoftwareSchema } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Spectrix API Monitoring Tool – Uptime, Latency & Alerts",
  description:
    "Learn what an API monitoring tool is and how Spectrix helps teams monitor uptime, latency, and alerts in production.",
  path: "/api-monitoring-tool",
  keywords: [
    "api monitoring tool",
    "uptime monitoring",
    "latency tracking",
    "endpoint monitoring",
    "spectrix",
  ],
  ogImage: "/meta/hero.png",
  twitterImage: "/meta/hero.png",
  schema: getSoftwareSchema({
    "@id": `${siteConfig.url}#api-monitoring-guide`,
  }),
});

const benefits = [
  {
    title: "Track uptime",
    description: "See when endpoints become unavailable and respond faster.",
  },
  {
    title: "Watch latency",
    description: "Identify response-time changes before they become incidents.",
  },
  {
    title: "Send alerts",
    description: "Notify the right channel through Slack, Discord, or webhooks.",
  },
];

export default function ApiMonitoringToolPage() {
  return (
    <main className="min-h-screen bg-page text-body">
      <Navbar />

      <section className="border-b border-dashed border-white/10 bg-page py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-5 inline-flex items-center gap-2 bg-surface-2 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-primary">
            Guide
          </div>
          <h1 className="max-w-4xl text-5xl font-light leading-[1.05] tracking-tighter text-heading sm:text-6xl lg:text-7xl">
            Spectrix - API Monitoring Tool for Developers
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-body-strong sm:text-xl">
            Spectrix helps teams monitor uptime, latency, incidents, and
            endpoint health with a lightweight dashboard built for production
            APIs.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center border border-primary bg-primary px-5 py-3 text-xs font-medium uppercase tracking-wide text-black transition-colors hover:bg-primary-strong"
            >
              Open dashboard
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center border border-border bg-surface-1 px-5 py-3 text-xs font-medium uppercase tracking-wide text-heading transition-colors hover:bg-white/5"
            >
              Back to homepage
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-dashed border-white/10 bg-page py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 border border-dashed border-white/10 bg-surface-2 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-primary">
              Definition
            </div>
            <h2 className="text-4xl font-light leading-[1.05] tracking-tighter text-heading sm:text-5xl">
              What is an API monitoring tool?
            </h2>
          </div>

          <div className="border border-dashed border-white/10 bg-surface-1 p-6 sm:p-8">
            <p className="text-base leading-relaxed text-body-strong sm:text-lg">
              An API monitoring tool helps developers check endpoint uptime,
              response time, and error behavior over time. Spectrix keeps that
              workflow simple by pairing checks, alerts, and dashboard visibility
              in one place.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {benefits.map((item) => (
                <div key={item.title} className="border border-border bg-page p-4">
                  <h3 className="text-sm font-medium uppercase tracking-[0.16em] text-heading">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-body">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section id="why-it-matters" className="border-b border-dashed border-white/10 bg-page py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-light tracking-tighter text-heading sm:text-4xl">Why API monitoring matters</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-body-strong">
            Downtime and slow APIs directly affect user experience and revenue. Even small outages can
            cause support load and lost conversions. Monitoring gives teams early detection and a
            reproducible signal to investigate problems quickly.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="p-4 border border-border bg-page">
              <h3 className="text-sm font-medium text-heading">Reduce mean time to detection</h3>
              <p className="mt-2 text-sm text-body">Automated checks surface failures before customers report them.</p>
            </div>
            <div className="p-4 border border-border bg-page">
              <h3 className="text-sm font-medium text-heading">Protect revenue</h3>
              <p className="mt-2 text-sm text-body">Even short outages can cause measurable business impact; monitoring limits exposure.</p>
            </div>
            <div className="p-4 border border-border bg-page">
              <h3 className="text-sm font-medium text-heading">Improve reliability over time</h3>
              <p className="mt-2 text-sm text-body">Historical checks reveal regressions and help prioritize fixes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-b border-dashed border-white/10 bg-page py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-light tracking-tighter text-heading sm:text-4xl">How API monitoring works</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-body-strong">
            Monitoring systems run synthetic checks against your endpoints at configured intervals. Checks
            validate response codes, response time, and optionally body contents. When a check fails,
            alerting rules determine whether and where notifications are sent.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-heading">Checks & intervals</h4>
              <p className="mt-1 text-sm text-body">Define how often an endpoint is checked (e.g. 30s, 5m). Shorter intervals provide faster detection but increase load.</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-heading">Expected responses</h4>
              <p className="mt-1 text-sm text-body">Configure expected status codes and response assertions so the monitor knows what success looks like.</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-heading">Alerts and integrations</h4>
              <p className="mt-1 text-sm text-body">When checks fail, notify teams via Slack, Discord, or webhooks. Use retries and grouping rules to avoid noisy alerts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Types of monitoring */}
      <section id="types" className="border-b border-dashed border-white/10 bg-page py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-light tracking-tighter text-heading sm:text-4xl">Types of monitoring</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="p-4 border border-border bg-page">
              <h3 className="text-sm font-medium text-heading">Uptime</h3>
              <p className="mt-2 text-sm text-body">Simple checks to verify an endpoint is reachable and returning expected codes.</p>
            </div>
            <div className="p-4 border border-border bg-page">
              <h3 className="text-sm font-medium text-heading">Latency</h3>
              <p className="mt-2 text-sm text-body">Track response-time trends and alert on regressions that impact user experience.</p>
            </div>
            <div className="p-4 border border-border bg-page">
              <h3 className="text-sm font-medium text-heading">Synthetic checks</h3>
              <p className="mt-2 text-sm text-body">Scripted or configured checks that exercise typical user flows (e.g., login, checkout).</p>
            </div>
          </div>
        </div>
      </section>

      {/* How Spectrix is different */}
      <section id="why-spectrix" className="border-b border-dashed border-white/10 bg-page py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-light tracking-tighter text-heading sm:text-4xl">How Spectrix is different</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-body-strong">
            Spectrix focuses on lightweight, developer-friendly monitoring: path-only endpoints, quick setup, and integrations that fit modern workflows. It emphasizes fast time-to-value for small teams.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="p-4 border border-border bg-page">
              <h3 className="text-sm font-medium text-heading">Lightweight</h3>
              <p className="mt-2 text-sm text-body">Minimal setup and low operational overhead.</p>
            </div>
            <div className="p-4 border border-border bg-page">
              <h3 className="text-sm font-medium text-heading">Developer-focused</h3>
              <p className="mt-2 text-sm text-body">Design and workflows tuned for engineering teams, not ops-only tooling.</p>
            </div>
            <div className="p-4 border border-border bg-page">
              <h3 className="text-sm font-medium text-heading">Integrated alerts</h3>
              <p className="mt-2 text-sm text-body">Built-in support for Slack, Discord, and webhooks so notifications reach your team quickly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related links kept below in a slimmer block for users */}
      <section className="border-b border-dashed border-white/10 bg-page py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center border border-border bg-page px-4 py-2 text-xs font-medium uppercase tracking-wide text-heading transition-colors hover:bg-white/5"
            >
              Homepage
            </Link>
            <Link
              href="/#features"
              className="inline-flex items-center justify-center border border-border bg-page px-4 py-2 text-xs font-medium uppercase tracking-wide text-heading transition-colors hover:bg-white/5"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="inline-flex items-center justify-center border border-border bg-page px-4 py-2 text-xs font-medium uppercase tracking-wide text-heading transition-colors hover:bg-white/5"
            >
              How it works
            </Link>
            <Link
              href="https://github.com/aakash-gupta02/Spectrix"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center border border-border bg-page px-4 py-2 text-xs font-medium uppercase tracking-wide text-heading transition-colors hover:bg-white/5"
            >
              GitHub
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
