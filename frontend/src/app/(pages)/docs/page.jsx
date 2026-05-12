import { CodeBlock } from "@/components/docs/CodeBlock";
import { StepSection } from "@/components/docs/StepSection";

export const metadata = {
  title: "Documentation - Spectrix",
  description: "Learn how to integrate and use Spectrix in your applications.",
};

export default function DocsPage() {
  const steps = [
    {
      title: "Install the SDK",
      content: (
        <>
          <p className="mb-4 text-body">
            Get started by installing the Spectrix SDK via npm, yarn, or pnpm.
          </p>
          <CodeBlock
            language="bash"
            code="npm install @spectrix/node-sdk"
          />
        </>
      ),
    },
    {
      title: "Initialize the Client",
      content: (
        <>
          <p className="mb-4 text-body">
            Import and configure the SDK with your API key. You can find this in your dashboard settings.
          </p>
          <CodeBlock
            title="src/lib/spectrix.js"
            language="javascript"
            code={`import { Spectrix } from '@spectrix/node-sdk';\n\nconst spectrix = new Spectrix({\n  apiKey: process.env.SPECTRIX_API_KEY,\n  environment: 'production'\n});\n\nexport default spectrix;`}
          />
        </>
      ),
    },
    {
      title: "Send Your First Event",
      content: (
        <>
          <p className="mb-4 text-body">
            Use the client to capture important metrics, logs, or traces in your application lifecycle.
          </p>
          <CodeBlock
            language="javascript"
            code={`await spectrix.capture('user_signup', {\n  userId: '123',\n  plan: 'pro',\n  timestamp: new Date().toISOString()\n});`}
          />
        </>
      ),
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-heading sm:text-4xl mb-4">
          Introduction
        </h1>
        <p className="text-lg text-body">
          Welcome to the Spectrix documentation. Learn how to quickly integrate our telemetry parsing, logging, and metrics processing into your infrastructure.
        </p>
      </div>

      <div className="my-10 border-t border-dashed border-border" />

      <h2 className="text-2xl font-medium text-heading mb-6">Quick Start</h2>
      <p className="mb-6 text-body">
        Follow these steps to set up the Spectrix Node.js SDK and start streaming your data to the dashboard in under 5 minutes.
      </p>

      <StepSection steps={steps} />

      <div className="my-10 border-t border-dashed border-border" />

      <div className="p-6 bg-surface-2 border border-border rounded-lg">
        <h3 className="text-lg font-medium text-heading mb-2">Need Help?</h3>
        <p className="text-body text-sm mb-4">
          If you encounter any issues while setting up, please reach out to our support team or check our extensive troubleshooting guides.
        </p>
        <div className="flex gap-4">
          <a
            href="mailto:support@spectrix.com"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-primary-strong"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
