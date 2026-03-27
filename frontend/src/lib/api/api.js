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

export const serviceAPI = {
  // get all services
  getServices: async () => {
    const response = await apiClient.get("/service");
    return response.data;
  },

  // get a single service by ID
  getService: async (id) => {
    const response = await apiClient.get(`/services/${id}`);
    return response.data;
  },

  // create a new service
  createService: async (payload) => {
    const response = await apiClient.post("/service", payload);
    return response.data;
  },

  // update an existing service
  updateService: async (id, payload) => {
    const response = await apiClient.put(`/services/${id}`, payload);
    return response.data;
  },

  // delete a service
  deleteService: async (id) => {
    const response = await apiClient.delete(`/services/${id}`);
    return response.data;
  },
};

