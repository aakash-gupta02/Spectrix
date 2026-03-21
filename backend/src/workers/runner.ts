import axios from "axios";
import { Log } from "../modules/log/log.model.js";
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

export async function runCheck(endpoint: EndpointDocument) {
  const start = Date.now();
  const endpointId = (endpoint as any)?._id;

  try {
    const baseUrl = (endpoint.serviceId as any)?.baseUrl;

    if (!baseUrl) {
      throw new Error("Missing service baseUrl for endpoint check");
    }

    const url = baseUrl + endpoint.path;

    logger.info(
      `[worker] START endpointId=${endpointId} ${endpoint.method} ${url}`
    );

    const res = await axios({
      method: endpoint.method,
      url,
      params: toStringRecord(endpoint.query),
      headers: toStringRecord(endpoint.headers),
      data: endpoint.body,
      timeout: endpoint.timeout
    });

    const responseTime = Date.now() - start;
    
    const isSuccess = endpoint.expectedStatus?.length
      ? endpoint.expectedStatus.includes(res.status)
      : res.status >= 200 && res.status < 300;

    await Log.create({
      endpointId: (endpoint as any)._id,
      userId: endpoint.userId,
      result: isSuccess ? "success" : "failure",
      statusCode: res.status,
      responseTime,
      errorMessage: isSuccess
        ? undefined
        : `Unexpected status code: ${res.status}`
    });

    logger.info(
      `[worker] ${isSuccess ? "PASS" : "FAIL"} endpointId=${endpointId} ${endpoint.method} ${url} status=${res.status} responseTime=${responseTime}ms`
    );


  } catch (err: any) {
    const responseTime = Date.now() - start;
    const errorMessage = getErrorMessage(err);
    const statusCode = err?.response?.status || null;

    await Log.create({
      endpointId,
      userId: endpoint.userId,
      result: "failure",
      statusCode,
      responseTime,
      errorMessage
    });

    logger.error(
      `[worker] FAIL endpointId=${endpointId} ${endpoint.method} ${endpoint.path} status=${statusCode ?? "N/A"} responseTime=${responseTime}ms error=${errorMessage}`
    );

  }

}