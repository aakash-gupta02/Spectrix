// Stream event types for SSE communication
export const STREAM_EVENTS = {
    SESSION_STARTED: "session-started",
    SESSION_EXPIRED: "session-expired",
    STREAM_ENDED: "stream-ended",
    UNAUTHORIZED: "unauthorized",
    HEARTBEAT_TIMEOUT: "heartbeat-timeout",
    INTERNAL_ERROR: "internal-error",
    LOG_BATCH: "log-batch",
    HEARTBEAT: "heartbeat",
    EXPIRY_WARNING: "expiry-warning",
};

export const STREAM_EVENT_MESSAGES = {
    [STREAM_EVENTS.SESSION_STARTED]: "Your stream session has started.",
    [STREAM_EVENTS.SESSION_EXPIRED]: "Your stream session has expired.",
    [STREAM_EVENTS.STREAM_ENDED]: "Live stream ended.",
    [STREAM_EVENTS.UNAUTHORIZED]: "Unauthorized stream access.",
    [STREAM_EVENTS.HEARTBEAT_TIMEOUT]: "Connection timeout occurred.",
    [STREAM_EVENTS.INTERNAL_ERROR]: "Internal stream error occurred.",
    [STREAM_EVENTS.EXPIRY_WARNING]: "Stream expiring soon",
};

export const STREAM_EVENT_STYLES = {
    [STREAM_EVENTS.SESSION_STARTED]: "success",
    [STREAM_EVENTS.SESSION_EXPIRED]: "error",
    [STREAM_EVENTS.EXPIRY_WARNING]: "warning",
    [STREAM_EVENTS.HEARTBEAT]: "info",
    [STREAM_EVENTS.STREAM_ENDED]: "info",
};