import axios from "axios";

export const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1";

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
