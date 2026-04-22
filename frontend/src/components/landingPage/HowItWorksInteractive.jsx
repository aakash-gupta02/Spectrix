"use client";

import { useState } from "react";
import Image from "next/image";

export default function HowItWorksInteractive({ steps }) {
  const [active, setActive] = useState(steps[0].key);
  const current = steps.find((s) => s.key === active) || steps[0];

  return (
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
                <p className="text-sm opacity-80 mt-1">
                  {step.description}
                </p>
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
  );
}