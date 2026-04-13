import axios from "axios";
import { env } from "../../../config/env.js";

export async function sendSlack(message: string) {
  const url = env.SLACK_WEBHOOK_URL;

  if (!url) return;

  await axios.post(url, {
    text: message,
  });
}
