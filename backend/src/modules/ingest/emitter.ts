import EventEmitter from "events";

export const streamEmitter = new EventEmitter();

// Increase max listeners to handle multiple concurrent SSE connections
streamEmitter.setMaxListeners(100);
