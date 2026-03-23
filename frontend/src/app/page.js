import React from "react";
import Navbar from "@/components/landingPage/Navbar";
import Hero from "@/components/landingPage/Hero";
import Marquee from "@/components/landingPage/Marquee";
import Features from "@/components/landingPage/Features";

const page = () => {
  return (
    <main className="min-h-screen bg-page text-body">
      <Navbar />
      <Hero />
      <Marquee />
      <Features />
    </main>
  );
};

export default page;