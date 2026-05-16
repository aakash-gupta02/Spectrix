import { DocsPageHeader } from "@/components/docs/DocsPageHeader";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { CodeTabs } from "@/components/docs/CodeTabs";
import {
  typescriptCode,
  javascriptCode,
  expressMiddlewareCode,
  jsonLogCode,
  sourceConfigCode,
} from "./code-snippets";

export const metadata = {
  title: "Real-Time Log Streaming - Spectrix Documentation",
  description:
    "Learn how to monitor your APIs and backend services in real-time with Spectrix log streaming.",
};

export default function RealTimeStreamingDocPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <DocsPageHeader
        title="Real-Time Log Streaming"
        description="Spectrix provides real-time log monitoring for your APIs and backend services. Once connected, logs appear instantly inside the dashboard without refreshing the page."
      />

      <div className="space-y-12">
        {/* How It Works */}
        <section>
          <h2 className="text-2xl font-medium text-heading mb-4">
            How It Works
          </h2>

          <h3 className="text-xl font-medium text-heading mb-2 mt-6">
            1. Create a Service
          </h3>
          <p className="text-body mb-4">
            A Service represents the application or API you want to monitor.
          </p>
          <ul className="list-disc pl-5 mb-4 text-body space-y-1">
            <li>Production API</li>
            <li>Auth Backend</li>
            <li>Payment Service</li>
          </ul>
          <p className="text-body mb-4">
            Each service gets its own isolated realtime stream.
          </p>

          <h3 className="text-xl font-medium text-heading mb-2 mt-6">
            2. Generate a Stream Key
          </h3>
          <p className="text-body mb-4">
            Inside the dashboard, navigate through:
          </p>
          <CodeBlock
            code="Service → Streams → Create Stream Key"
            language="txt"
          />
          <p className="text-body my-4">
            You&apos;ll receive a secret ingest key:
          </p>
          <CodeBlock code="spx_v1_live_xxxxxxxxx" language="txt" />
          <p className="text-body my-4">
            Store this securely in your backend environment variables. Example:
          </p>
          <CodeBlock
            code="SPECTRIX_API_KEY=spx_v1_live_xxxxxxxxx"
            language="env"
            title=".env"
          />

          <h3 className="text-xl font-medium text-heading mb-2 mt-6">
            3. Use Spectrix Middleware
          </h3>
          <p className="text-body mb-4">
            You can use this Node.js middleware to automatically capture
            requests. Create a file called <code>spectrix.ts</code> or{" "}
            <code>spectrix.js</code> in your project, copy the code below, and
            import it into your app.
          </p>

          <CodeTabs
            tabs={[
              {
                name: "TypeScript",
                code: typescriptCode,
                language: "typescript",
              },
              {
                name: "JavaScript",
                code: javascriptCode,
                language: "javascript",
              },
            ]}
          />

          <h4 className="text-lg font-medium text-heading mt-6 mb-2">
            Using the Middleware (Express)
          </h4>
          <CodeBlock
            code={expressMiddlewareCode}
            language="javascript"
            title="app.js"
          />

          <h3 className="text-xl font-medium text-heading mb-2 mt-6">
            4. Start Monitoring
          </h3>
          <p className="text-body mb-4">Inside the dashboard navigate to:</p>
          <CodeBlock code="Streams → Watch" language="txt" />
          <p className="text-body mt-4">
            Spectrix creates a temporary live session and opens a realtime
            stream for that service. Incoming logs will appear instantly in the
            monitoring dashboard.
          </p>
        </section>

        {/* Real-Time Features */}
        <section>
          <h2 className="text-2xl font-medium text-heading mb-4">
            Real-Time Features
          </h2>

          <h3 className="text-xl font-medium text-heading mb-2 mt-6">
            Live Request Logs
          </h3>
          <p className="text-body mb-4">Monitor in real time:</p>
          <ul className="list-disc pl-5 mb-4 text-body space-y-1">
            <li>Successful requests</li>
            <li>Failed requests</li>
            <li>Warnings</li>
            <li>Debug events</li>
          </ul>

          <h3 className="text-xl font-medium text-heading mb-2 mt-6">
            Service Isolation
          </h3>
          <p className="text-body mb-4">
            Each service has its own independent stream. Only logs from the
            selected service are displayed.
          </p>

          <h3 className="text-xl font-medium text-heading mb-2 mt-6">
            Automatic Session Expiration
          </h3>
          <p className="text-body mb-4">
            Realtime stream sessions automatically expire after a short duration
            for security. You can reconnect anytime from the dashboard.
          </p>
        </section>

        {/* Example Log Data */}
        <section>
          <h2 className="text-2xl font-medium text-heading mb-4">
            Example Log Data
          </h2>
          <p className="text-body mb-4">
            Spectrix captures structured logs like:
          </p>
          <CodeBlock code={jsonLogCode} language="json" />
        </section>

        {/* Optional Source Labels */}
        <section>
          <h2 className="text-2xl font-medium text-heading mb-4">
            Optional Source Labels
          </h2>
          <p className="text-body mb-4">
            You can organize logs using <code>source</code>. Useful for
            microservices, workers, queues, and background jobs.
          </p>
          <CodeBlock code={sourceConfigCode} language="javascript" />
        </section>

        {/* Supported Log Levels */}
        <section>
          <h2 className="text-2xl font-medium text-heading mb-4">
            Supported Log Levels
          </h2>
          <ul className="list-disc pl-5 mb-4 text-body space-y-1">
            <li>info</li>
            <li>warn</li>
            <li>error</li>
            <li>debug</li>
          </ul>
        </section>

        {/* Typical Use Cases */}
        <section>
          <h2 className="text-2xl font-medium text-heading mb-4">
            Typical Use Cases
          </h2>
          <ul className="list-disc pl-5 mb-4 text-body space-y-1">
            <li>API monitoring</li>
            <li>Realtime debugging</li>
            <li>Request tracing</li>
            <li>Backend observability</li>
            <li>Production issue tracking</li>
            <li>Error monitoring</li>
          </ul>
        </section>

        {/* Notes */}
        <section>
          <h2 className="text-2xl font-medium text-heading mb-4">Notes</h2>
          <ul className="list-disc pl-5 mb-4 text-body space-y-1">
            <li>Logs are batched automatically for performance.</li>
            <li>Realtime streams reconnect automatically if interrupted.</li>
            <li>Stream sessions are temporary and secure.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
