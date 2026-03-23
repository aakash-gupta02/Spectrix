import React from "react";
import Navbar from "@/components/landingPage/Navbar";
import Hero from "@/components/landingPage/Hero";

const page = () => {
  return (
    <main className="min-h-screen bg-page text-body">
      <Navbar />
      <Hero />
    </main>
  );
};

export default page;