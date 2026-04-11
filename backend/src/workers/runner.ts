import axios from "axios";
import { EndpointDocument } from "../modules/endpoint/endpoint.model.js";
import { logger } from "../config/logger.js";

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const statusText = error.response?.statusText;
    const responseData = error.response?.data;
    const responsePayload =
      typeof responseData === "string"
        ? responseData
        : responseData
          ? JSON.stringify(responseData)
          : "";

    return [error.message, statusText, responsePayload]
      .filter(Boolean)
      .join(" | ")
      .slice(0, 500);
  }

  if (error instanceof Error) {
    return error.message.slice(0, 500);
  }

  if (typeof error === "string") {
    return error.slice(0, 500);
  }

  return "Unknown monitoring error";
};

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

// Sleep function to pause execution for a given number of milliseconds
const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// Calculate the next check time for an endpoint based on its interval and last check time
export const calculateNextCheckAt = (endpoint: EndpointDocument) => {
  const now = new Date();

  if (!endpoint.nextCheckAt) {
    return new Date(now.getTime() + endpoint.interval * 1000);
  }

  let nextCheckAt = new Date(
    endpoint.nextCheckAt.getTime() + endpoint.interval * 1000,
  );

  // If we are behind schedule, reset from now
  if (nextCheckAt < now) {
    nextCheckAt = new Date(now.getTime() + endpoint.interval * 1000);
  }

  return nextCheckAt;
};

// Actual API Call
async function apiCheck(endpoint: EndpointDocument) {
  const start = Date.now();
  const baseUrl = (endpoint.serviceId as any)?.baseUrl;

  if (!baseUrl) {
    throw new Error("Missing service baseUrl for endpoint check");
  }

  try {
    const res = await axios({
      method: endpoint.method,
      url: baseUrl + endpoint.path,
      params: toStringRecord(endpoint.query),
      headers: toStringRecord(endpoint.headers),
      data: endpoint.body,
      timeout: endpoint.timeout || 3000,
      validateStatus: () => true,
    });

    const responseTime = Date.now() - start;

    const isSuccess = endpoint.expectedStatus?.length
      ? endpoint.expectedStatus.includes(res.status)
      : res.status >= 200 && res.status < 300;

    return {
      result: isSuccess ? "success" : "failure",
      statusCode: res.status,
      responseTime,
      errorMessage: isSuccess ? undefined : `Unexpected status ${res.status}`,
    };
  } catch (err) {
    let type = "network";

    if (axios.isAxiosError(err)) {
      if (err.code === "ECONNABORTED") type = "timeout";
      else if (err.code === "ENOTFOUND") type = "dns";
      else if (err.code === "ECONNREFUSED") type = "refused";
      else type = "network";

      logger.error(
        `API Check error for endpoint ${endpoint.name}: ${err.code}`,
      );
    } else if (err instanceof Error) {
      logger.error(`API Check error: ${err.message}`);
    } else {
      logger.error(`API Check error: ${String(err)}`);
    }

    return {
      result: "failure",
      statusCode: null,
      responseTime: Date.now() - start,
      errorMessage: getErrorMessage(err),
      errorType: type,
    };
  }
}

// Retry function for AOI Checks
export async function retryApiCheck(endpoint: EndpointDocument) {
  const retries = Math.max(1, endpoint.retries ?? 1);
  const endpointId = (endpoint as any)?._id;

  let finalResult;

  for (let attempt = 1; attempt <= retries; attempt++) {
    logger.info(
      `[worker] Attempt ${attempt}/${retries} endpointId=${endpointId}`,
    );

    const res = await apiCheck(endpoint);

    finalResult = res;

    if (res.result === "success") break;

    if (attempt < retries) {
      await sleep(1000);
    }
  }

  return finalResult;
}
