import React from "react";
import Navbar from "@/components/landingPage/Navbar";
import Hero from "@/components/landingPage/Hero";
import Marquee from "@/components/landingPage/Marquee";
import Features from "@/components/landingPage/Features";
import Capabilities from "@/components/landingPage/Capabilities";
import Integration from "@/components/landingPage/Integration";

const page = () => {
  return (
    <main className="min-h-screen bg-page text-body">
      <Navbar />
      <Hero />
      <Marquee />
      <Features />
      <Capabilities />
      {/* <Integration /> */}
    </main>
  );
};

export default page;