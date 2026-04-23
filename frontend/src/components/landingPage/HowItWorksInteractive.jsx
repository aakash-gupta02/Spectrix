"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function HowItWorksInteractive({ steps }) {
  const [active, setActive] = useState(steps[0].key);
  const current = steps.find((s) => s.key === active) || steps[0];

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16 items-start">
        {/* LEFT: Steps */}
        <div className="lg:col-span-5 space-y-4">
          {steps.map((step, i) => {
            const isActive = active === step.key;

            return (
              <div key={step.key}>
                <button
                  key={step.key}
                  onClick={() => setActive(step.key)}
                  className={`w-full text-left p-5 transition-all border border-dashed
              ${
                isActive
                  ? "bg-primary text-black border-primary"
                  : "bg-surface-2 border-border text-body hover:bg-surface-3"
              }`}
                >
                  <p className="text-xs uppercase tracking-widest mb-1">
                    Step {i + 1}
                  </p>
                  <h3 className="text-lg font-medium">{step.title}</h3>
                  <p className="text-sm opacity-80 mt-1">{step.description}</p>
                </button>

                {/* MOBILE CARD (only active step) */}
                {isActive && (
                  <div className="lg:hidden mt-4 border border-dashed border-border bg-surface-1">
                    <div className="aspect-video w-full overflow-hidden border-b border-dashed border-border">
                      <Image
                        src={step.image}
                        alt={step.title}
                        width={1920}
                        height={1080}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="text-heading mb-1">{step.title}</h4>
                      <p className="text-sm text-body">{step.description}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT: Desktop Preview */}
        <div className="hidden lg:block lg:col-span-7">
          <div className="border border-dashed border-border bg-surface-1">
            {/* 16:9 Image */}
            <div className="aspect-video w-full overflow-hidden border-b border-dashed border-border">
              <Image
                src={current.image}
                alt={current.title}
                width={1920}
                height={1080}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl text-heading mb-2">{current.title}</h3>
              <p className="text-body text-sm leading-relaxed">
                {current.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DEMO CTA */}
      <div className="mt-6 border border-border bg-surface-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 py-10 md:px-10 md:py-12">
          <div>
            <h3 className="text-2xl font-medium tracking-tight text-heading sm:text-3xl">
              Try <span className="text-primary">Spectrix</span> instantly
            </h3>
            <p className="mt-2 max-w-md text-body">
              Skip setup. Explore a live dashboard.
            </p>
          </div>

          <div className="flex items-start justify-start md:justify-end">
            <a
              href="/login?loginDemo=true"
              className="group inline-flex items-center gap-2 border border-border bg-page px-6 py-3 text-sm font-medium text-heading transition-all hover:border-primary hover:text-primary"
            >
              Try live dashboard
              <ArrowUpRight
                size={18}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
