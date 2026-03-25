import axios from "axios";

const baseUrl = "http://localhost:4000/api";

const apiClient = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default apiClient;
