import axios from "axios";
import { StatusCodes } from "http-status-codes";

import ApiError from "../../../utils/ApiError.js";

export async function sendSlack(url: string, message: string) {
  if (!url) return;

  try {
    const response = await axios.post(
      url,
      { text: message },
      { timeout: 5000, validateStatus: () => true },
    );

    // fail manually if bad response
    if (response.status >= 400) {
      throw new ApiError(
        StatusCodes.BAD_GATEWAY,
        `Slack webhook responded with status ${response.status}`,
      );
    }

    return response;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(StatusCodes.BAD_GATEWAY, "Failed to send Slack alert");
  }
}
