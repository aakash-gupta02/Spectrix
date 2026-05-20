"use client";

import Container from "@/components/dashboard/common/Container";
import SectionHeading from "@/components/dashboard/common/SectionHeading";
import DashboardButton from "@/components/ui/DashboardButton";
import LogTable from "@/components/dashboard/streams/LogTable";
import { useEffect, useMemo, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { RefreshCw, Signal, WifiOff, Clock } from "lucide-react";
import { ingestAPI } from "@/lib/api/api";
import { baseUrl } from "@/lib/api/client";
import toast from "react-hot-toast";

const Page = () => {
  const params = useParams();
  const serviceId = params.serviceId;
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const [events, setEvents] = useState([]);
  const [eventSourceKey, setEventSourceKey] = useState(0);
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  const eventSourceRef = useRef(null);

  // Timer effect
  useEffect(() => {
    if (!expiresAt) {
      return;
    }

    const updateTimer = () => {
      const remaining = expiresAt - Date.now();
      if (remaining <= 0) {
        setTimeLeft("");
        setExpiresAt(null);
        return;
      }

      const seconds = Math.floor(remaining / 1000);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;

      if (minutes > 0) {
        setTimeLeft(`${minutes}m ${remainingSeconds}s`);
      } else {
        setTimeLeft(`${remainingSeconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  useEffect(() => {
    if (typeof window === "undefined" || !serviceId) {
      return;
    }

    let sessionExpired = false;
    let source = null;

    const connectStream = async () => {
      try {
        // Create stream session
        await ingestAPI.createIngestSession({ serviceId });

        source = new EventSource(`${baseUrl}/ingest/sse/${serviceId}`, {
          withCredentials: true,
        });

        eventSourceRef.current = source;

        source.onopen = () => {
          setIsConnected(true);
          setConnectionError("");
          toast.success("Connected to log stream");
        };

        // Handle different event types
        source.addEventListener("session-started", (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.expiresAt) {
              setExpiresAt(data.expiresAt);
            }
            console.log("Session started:", data);
          } catch (e) {
            console.error("Failed to parse session-started:", e);
          }
        });

        source.addEventListener("expiry-warning", (event) => {
          try {
            const data = JSON.parse(event.data);
            toast.success(data.message);
          } catch (e) {
            console.error("Failed to parse expiry-warning:", e);
          }
        });

        source.addEventListener("session-expired", (event) => {
          try {
            const data = JSON.parse(event.data);
            sessionExpired = true;
            setIsConnected(false);
            setConnectionError(data.message);
            setExpiresAt(null);
            toast.error(data.message);
            source?.close();
          } catch (e) {
            console.error("Failed to parse session-expired:", e);
          }
        });

        // Handle log batches - THIS IS THE IMPORTANT ONE
        source.addEventListener("log-batch", (event) => {
          try {
            const data = JSON.parse(event.data);
            const batch = Array.isArray(data.batch) ? data.batch : [data.batch];

            setEvents((current) =>
              [
                {
                  id: crypto.randomUUID(),
                  receivedAt: new Date().toISOString(),
                  batch: batch,
                },
                ...current,
              ].slice(0, 25),
            );

            console.log("Received log batch:", batch.length, "logs");
          } catch (e) {
            console.error("Failed to parse log batch:", e);
          }
        });

        // Handle heartbeat
        source.addEventListener("heartbeat", (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.timeUntilExpiry) {
              setExpiresAt(Date.now() + data.timeUntilExpiry);
            }
          } catch (e) {
            console.error("Failed to parse heartbeat:", e);
          }
        });

        // Fallback for onmessage (if server sends raw JSON)
        source.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            // Check if it's a log batch
            if (parsed.batch || Array.isArray(parsed)) {
              const batch = Array.isArray(parsed) ? parsed : parsed.batch;
              setEvents((current) =>
                [
                  {
                    id: crypto.randomUUID(),
                    receivedAt: new Date().toISOString(),
                    batch: batch,
                  },
                  ...current,
                ].slice(0, 25),
              );
              console.log(
                "Received via onmessage:",
                batch?.length || 1,
                "logs",
              );
            }
          } catch (e) {
            // Not JSON, ignore
          }
        };

        source.onerror = (err) => {
          console.error("EventSource error:", err);
          setIsConnected(false);
          if (!sessionExpired) {
            setConnectionError("Stream disconnected");
            toast.error("Stream disconnected");
          }
        };
      } catch (error) {
        console.error("Connection error:", error);
        setIsConnected(false);
        const errorMsg =
          error?.response?.data?.message || "Unable to connect to live stream.";
        setConnectionError(errorMsg);
        toast.error(errorMsg);
      }
    };

    connectStream();

    return () => {
      if (source) {
        source.close();
        source = null;
      }
    };
  }, [serviceId, eventSourceKey]);

  const totalLogs = useMemo(
    () =>
      events.reduce((count, event) => count + (event.batch?.length || 0), 0),
    [events],
  );

  const rows = useMemo(
    () =>
      events.flatMap((event) =>
        (event.batch || []).map((log, index) => ({
          id: `${event.id}-${index}`,
          receivedAt: event.receivedAt,
          ...log,
        })),
      ),
    [events],
  );

  const handleReconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setEvents([]);
    setConnectionError("");
    setExpiresAt(null);
    setTimeLeft("");
    setEventSourceKey((key) => key + 1);
    toast.loading("Reconnecting...");
    setTimeout(() => toast.dismiss(), 2000);
  };

  return (
    <Container>
      <SectionHeading
        title="Streams Watch"
        description="Live SSE feed from /ingest/sse rendered as a clear log table."
      >
        <div className="flex items-center gap-3">
          {timeLeft && isConnected && (
            <div
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-mono border ${
                timeLeft.includes("m") && parseInt(timeLeft) < 1
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse"
                  : "bg-surface-1 text-heading border-border"
              }`}
            >
              <Clock size={12} />
              <span>{timeLeft}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 rounded-full bg-surface-1 px-2.5 py-1 text-xs border border-border">
            {isConnected ? (
              <>
                <Signal size={12} className="text-emerald-400" />
                <span className="text-emerald-400">Live</span>
              </>
            ) : (
              <>
                <WifiOff size={12} className="text-rose-400" />
                <span className="text-rose-400">Offline</span>
              </>
            )}
          </div>

          <div className="rounded-full bg-surface-1 px-2.5 py-1 text-xs text-body border border-border">
            {events.length} / {totalLogs}
          </div>

          <DashboardButton variant="secondary" onClick={handleReconnect}>
            <RefreshCw size={14} />
            Reconnect
          </DashboardButton>
        </div>
      </SectionHeading>

      {connectionError && (
        <div className="mb-4 flex items-center gap-2 rounded border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
          <span>⚠️</span>
          <span>{connectionError}</span>
        </div>
      )}

      <LogTable rows={rows} isConnected={isConnected} />
    </Container>
  );
};

export default Page;
