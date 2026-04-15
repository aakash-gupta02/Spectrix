import axios from "axios";
import { env } from "../../../config/env.js";

export async function sendDiscord(url: string, message: string) {
  if (!url) return;

  await axios.post(url, {
    content: message,
  });
}
