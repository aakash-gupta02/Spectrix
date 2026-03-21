import axios from "axios";
import { logger } from "../config/logger.js";

const toStringRecord = (value: unknown): Record<string, string> => {
  const result: Record<string, string> = {};

  const pushEntry = (key: unknown, val: unknown): void => {
    if (typeof key !== "string") return;
    if (val === undefined || val === null) return;
    result[key] = String(val);
  };

  if (!value) return result;

  if (value instanceof Map) {
    for (const [key, val] of value.entries()) {
      pushEntry(key, val);
    }
    return result;
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      if (!Array.isArray(entry) || entry.length < 2) continue;
      pushEntry(entry[0], entry[1]);
    }
    return result;
  }

  if (typeof value === "object") {
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      pushEntry(key, val);
    }
  }

  return result;
};

export async function runCheck(endpoint: any) {
  const start = Date.now();

  const baseUrl = endpoint.serviceId.baseUrl;
  const url = baseUrl + endpoint.path;

  try {
    const res = await axios({
      method: endpoint.method,
      url,
      params: toStringRecord(endpoint.query),
      headers: toStringRecord(endpoint.headers),
      data: endpoint.body,
      timeout: endpoint.timeout
    });

    const responseTime = Date.now() - start;

    logger.info(`Checked ${endpoint.method} ${url} - ${res.status} (${responseTime}ms)`, { endpointId: endpoint._id, statusCode: res.status, responseTime });

  } catch (err: any) {
    const responseTime = Date.now() - start;

    logger.error(`Error checking ${endpoint.method} ${url}: ${err.message}`, { endpointId: endpoint._id, statusCode: err?.response?.status || null, responseTime });
  }

}