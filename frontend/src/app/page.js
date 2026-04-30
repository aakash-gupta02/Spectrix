import Navbar from "@/components/landingPage/Navbar";
import Hero from "@/components/landingPage/Hero";
import Marquee from "@/components/landingPage/Marquee";
import Features from "@/components/landingPage/Features";
import Capabilities from "@/components/landingPage/Capabilities";
import HowItWorks from "@/components/landingPage/HowItWorks";
import CTA from "@/components/landingPage/CTA";
import Footer from "@/components/landingPage/Footer";
import { createPageMetadata, getSoftwareSchema } from "@/lib/seo/metadata";
import Guide from "@/components/landingPage/Guide";

export const metadata = createPageMetadata({
  title: "Spectrix API Monitoring Tool – Uptime, Latency & Alerts",
  description:
    "Spectrix is an API monitoring tool for developers who need uptime, latency, incident, and endpoint health visibility.",
  path: "/",
  keywords: [
    "spectrix",
    "api monitoring tool",
    "api uptime dashboard",
    "incident response",
    "service reliability",
  ],
  ogImage: "/meta/hero.png",
  twitterImage: "/meta/hero.png",
  schema: getSoftwareSchema(),
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
      <Guide />
      <CTA />
      {/* <Integration /> */}
      <Footer />
    </main>
  );
};

export default page;