import axios from "axios";
import env from "../config/env";

export const baseUrl = env.baseUrl;

const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${baseUrl}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        return apiClient(originalRequest);
      } catch {
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
