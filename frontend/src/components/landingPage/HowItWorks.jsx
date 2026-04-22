import SectionHeading from "../common/SectionHeading";
import HowItWorksInteractive from "./HowItWorksInteractive";

const steps = [
  {
    key: "service",
    title: "Add Your Service",
    description:
      "Define a service by setting its base URL.",
    image: "/screenshot/service.png",
  },
  {
    key: "api",
    title: "Add API Endpoints",
    description:
      "Attach endpoints to a service using path-based routes.",
    image: "/screenshot/api.png",
  },
  {
    key: "alerts",
    title: "Connect Alert Channels",
    description:
      "Choose where alerts should go: Slack, Discord, or webhook.",
    image: "/screenshot/alertChannel.png",
  },
  {
    key: "monitor",
    title: "Monitor And Respond",
    description:
      "Track incidents in the dashboard and get notified in real time.",
    image: "/screenshot/overview.png",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-page py-24 border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          eyebrow="02. How It Works"
          title="Go from zero to monitoring in minutes."
          description="A simple setup flow designed for small engineering teams."
        />

        <HowItWorksInteractive steps={steps} />
      </div>
    </section>
  );
}
