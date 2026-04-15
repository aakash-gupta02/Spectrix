import axios from "axios";
import { env } from "../../../config/env.js";

export async function sendSlack(url: string, message: string) {
  if (!url) return;

  await axios.post(url, {
    text: message,
  });
}
