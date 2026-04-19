import React from "react";
import Navbar from "@/components/landingPage/Navbar";
import Hero from "@/components/landingPage/Hero";
import Marquee from "@/components/landingPage/Marquee";
import Features from "@/components/landingPage/Features";
import Capabilities from "@/components/landingPage/Capabilities";
import HowItWorks from "@/components/landingPage/HowItWorks";
import Integration from "@/components/landingPage/Integration";
import CTA from "@/components/landingPage/CTA";
import Footer from "@/components/landingPage/Footer";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Spectrix | API Monitoring Platform",
  description:
    "Monitor uptime, latency, incidents, and endpoint health with a fast operational dashboard built for engineering teams.",
  path: "/",
  keywords: [
    "spectrix",
    "api monitoring platform",
    "api uptime dashboard",
    "incident response",
    "service reliability",
  ],
  ogImage: "/meta/hero.png",
  twitterImage: "/meta/hero.png",
});

const page = () => {
  return (
    <main className="min-h-screen bg-page text-body">
      <Navbar />
      <Hero />
      <Marquee />
      <Features />
      <HowItWorks />
      <Capabilities />
      <CTA />
      {/* <Integration /> */}
      <Footer />
    </main>
  );
};

export default page;