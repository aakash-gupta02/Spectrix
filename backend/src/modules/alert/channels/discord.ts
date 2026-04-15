import axios from "axios";
import { StatusCodes } from "http-status-codes";

import ApiError from "../../../utils/ApiError.js";

export async function sendDiscord(url: string, message: string) {
  if (!url) return;

  try {
    const response = await axios.post(
      url,
      { content: message },
      { timeout: 5000, validateStatus: () => true },
    );

    if (response.status >= 400) {
      throw new ApiError(
        StatusCodes.BAD_GATEWAY,
        `Discord webhook responded with status ${response.status}`,
      );
    }

    return response;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(StatusCodes.BAD_GATEWAY, "Failed to send Discord alert");
  }
}
