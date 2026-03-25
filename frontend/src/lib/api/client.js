import axios from "axios";

const baseUrl =
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
    (error) => {
        if (error?.response?.status === 401 && typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        }

        return Promise.reject(error);
    },
);

export default apiClient;
