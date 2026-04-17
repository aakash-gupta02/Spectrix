import React from "react";
import SectionHeading from "../common/SectionHeading";

const steps = [
  {
    title: "Add Your Service",
    description: "Create a service and add the API endpoints you want to monitor.",
  },
  {
    title: "Connect Alert Channels",
    description: "Choose where alerts should go: Slack, Discord, or webhook.",
  },
  {
    title: "Set Alert Rules",
    description: "Define thresholds for latency, downtime, and error rate.",
  },
  {
    title: "Monitor And Respond",
    description: "Track incidents in the dashboard and get notified in real time.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 border-b border-dashed border-white/10 bg-page py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="02. How It Works"
          title="Go from zero to monitoring in minutes."
          description="A simple setup flow designed for small engineering teams."
        />

        <div className="grid grid-cols-1 border border-dashed border-white/10 md:grid-cols-4">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="border-b border-dashed border-white/10 p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
            >
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">
                Step {index + 1}
              </p>
              <h3 className="mb-2 text-lg text-white">{step.title}</h3>
              <p className="text-sm leading-relaxed text-white/70">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
