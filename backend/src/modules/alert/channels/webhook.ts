import axios from "axios";

function sendWebhook(url: string, message: string) {
  return axios.post(url, { message });
}

export default sendWebhook;