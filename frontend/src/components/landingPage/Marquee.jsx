import React from "react";

const partners = ["Stripe", "Vercel", "GitHub", "Supabase", "Linear"];

export default function Marquee() {
  const marqueeItems = [...partners, ...partners];

  return (
    <section className="group border-b border-dashed border-white/10 bg-page">
      <div className="mx-auto max-w-screen-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="relative z-10 col-span-12 flex items-center border-b border-dashed border-white/10 bg-page px-6 py-8 md:col-span-2 md:border-b-0 md:border-r md:px-10">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
              Built for teams using tools like
            </span>
          </div>

          <div
            className="col-span-12 flex h-20 items-center overflow-hidden md:col-span-10"
            style={{
              maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            }}
          >
            <div className="marquee-track">
              {marqueeItems.map((partner, index) => (
                <div
                  key={`${partner}-${index}`}
                  className="flex h-20 w-56 shrink-0 items-center justify-center border-r border-dashed border-white/10 opacity-45 transition-opacity duration-300 hover:opacity-100"
                >
                  <span className="text-lg font-medium tracking-tight text-white">{partner}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
