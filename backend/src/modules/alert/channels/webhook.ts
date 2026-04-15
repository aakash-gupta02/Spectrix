import axios from "axios";
import { StatusCodes } from "http-status-codes";

import ApiError from "../../../utils/ApiError.js";

async function sendWebhook(url: string, message: string) {
  if (!url) return;

  try {
    const response = await axios.post(
      url,
      { message },
      { timeout: 5000, validateStatus: () => true },
    );

    if (response.status >= 400) {
      throw new ApiError(
        StatusCodes.BAD_GATEWAY,
        `Webhook responded with status ${response.status}`,
      );
    }

    return response;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(StatusCodes.BAD_GATEWAY, "Failed to send webhook alert");
  }
}

export default sendWebhook;