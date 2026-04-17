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