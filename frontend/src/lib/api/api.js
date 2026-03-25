import apiClient from "@/lib/api/client";

export const authAPI = {
  register: async (payload) => {
    const response = await apiClient.post("/auth/register", payload);
    return response.data;
  },
  login: async (payload) => {
    const response = await apiClient.post("/auth/login", payload);
    return response.data;
  },
};



