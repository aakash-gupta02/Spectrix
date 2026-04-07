import axios from "axios";
import { Log } from "../modules/log/log.model.js";
import { EndpointDocument } from "../modules/endpoint/endpoint.model.js";
import { logger } from "../config/logger.js";
import { handleIncidentService } from "../modules/incident/incident.service.js"; // Adjust path as needed

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
  const checkedAt = new Date();
  let result: "success" | "failure" = "failure";
  let statusCode: number | null = null;
  let responseTime: number;
  let errorMessage: string | undefined;

  try {
    const baseUrl = (endpoint.serviceId as any)?.baseUrl;

    if (!baseUrl) {
      throw new Error("Missing service baseUrl for endpoint check");
    }

    const url = baseUrl + endpoint.path;

    logger.info(
      `[worker] START endpointId=${endpointId} ${endpoint.method} ${url}`,
    );

    const res = await axios({
      method: endpoint.method,
      url,
      params: toStringRecord(endpoint.query),
      headers: toStringRecord(endpoint.headers),
      data: endpoint.body,
      timeout: endpoint.timeout,
      validateStatus: () => true, // IMPORTANT: Don't throw on any status code
    });

    responseTime = Date.now() - start;
    statusCode = res.status;

    // Fix: Check if expectedStatus exists and is an array
    const isSuccess =
      endpoint.expectedStatus &&
      Array.isArray(endpoint.expectedStatus) &&
      endpoint.expectedStatus.length > 0
        ? endpoint.expectedStatus.includes(res.status)
        : res.status >= 200 && res.status < 300;

    result = isSuccess ? "success" : "failure";

    if (!isSuccess) {
      errorMessage = `Unexpected status code: ${res.status}`;
    }

    await Log.create({
      endpointId: (endpoint as any)._id,
      serviceId: endpoint.serviceId,
      userId: endpoint.userId,
      result,
      statusCode,
      responseTime,
      errorMessage,
    });

    logger.info(
      `[worker] ${isSuccess ? "PASS" : "FAIL"} endpointId=${endpointId} ${endpoint.method} ${url} status=${res.status} responseTime=${responseTime}ms`,
    );
  } catch (err: any) {
    // This block only runs for network errors, timeouts, etc.
    // NOT for HTTP status codes like 409
    responseTime = Date.now() - start;
    errorMessage = getErrorMessage(err);
    statusCode = err?.response?.status || null;
    result = "failure";

    await Log.create({
      endpointId,
      serviceId: endpoint.serviceId,
      userId: endpoint.userId,
      result: "failure",
      statusCode,
      responseTime,
      errorMessage,
    });

    logger.error(
      `[worker] FAIL endpointId=${endpointId} ${endpoint.method} ${endpoint.path} status=${statusCode ?? "N/A"} responseTime=${responseTime}ms error=${errorMessage}`,
    );
  } finally {
    // Handle incident based on the result
    try {
      await handleIncidentService(endpoint, result, checkedAt);
    } catch (incidentError) {
      logger.error(
        `[worker] Failed to handle incident for endpoint ${endpointId}: ${String(incidentError)}`,
      );
    }
  }
}
