import axios from "axios";
import { env } from "../../../config/env.js";

export async function sendDiscord(message: string) {
  const url = env.DC_WEBHOOK_URL;

  if (!url) return;

  await axios.post(url, {
    content: message,
  });
}
