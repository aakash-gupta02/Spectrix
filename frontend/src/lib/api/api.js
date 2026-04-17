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
  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },
};

export const overviewAPI = {
  getOverviewMetrics: async ({ serviceId } = {}) => {
    const response = await apiClient.get("/metrics/overview", {
      params: {
        ...(serviceId ? { serviceId } : {}),
      },
    });

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
    const response = await apiClient.patch(`/service/${id}`, payload);
    return response.data;
  },

  // delete a service
  deleteService: async (id) => {
    const response = await apiClient.delete(`/service/${id}`);
    return response.data;
  },
};

const ENDPOINT_MODULE = "endpoint";
const ENDPOINT_METRICS_MODULE = "metrics/endpoint";
const INCIDENT_MODULE = "incident";
const LOGS_MODULE = "log";
const ALERT_CHANNEL_MODULE = "alert-channel";

export const endPointsAPI = {

  getEndPoints: async ({ serviceId } = {}) => {
    const response = await apiClient.get(`/${ENDPOINT_MODULE}`, {
      params: {
        ...(serviceId ? { serviceId } : {}),
      },
    });
    return response.data;
  },

  getEndPoint: async (id) => {
    const response = await apiClient.get(`/${ENDPOINT_MODULE}/${id}`);
    return response.data;
  },

  createEndpoint: async (payload) => {
    const response = await apiClient.post(`/${ENDPOINT_MODULE}`, payload);
    return response.data;
  },

  updateEndpoint: async (id, payload) => {
    const response = await apiClient.patch(`/${ENDPOINT_MODULE}/${id}`, payload);
    return response.data;
  },

  deleteEndpoint: async (id) => {
    const response = await apiClient.delete(`/${ENDPOINT_MODULE}/${id}`);
    return response.data;
  },

}

export const endpointMetricsAPI = {
  getTopLevelMetrics: async (endpointId) => {
    const response = await apiClient.get(`/${ENDPOINT_METRICS_MODULE}/${endpointId}/top-level`);
    return response.data;
  },

  getTimeSeries: async (endpointId) => {
    const response = await apiClient.get(`/${ENDPOINT_METRICS_MODULE}/${endpointId}/timeseries`);
    return response.data;
  },
};

export const incidentAPI = {
  getIncidents: async ({ serviceId } = {}) => {
    const response = await apiClient.get(`/${INCIDENT_MODULE}`, {
      params: {
        ...(serviceId ? { serviceId } : {}),
      },
    });
    return response.data;
  },

  getIncident: async (id) => {
    const response = await apiClient.get(`/${INCIDENT_MODULE}/${id}`);
    return response.data;
  },

};

export const logsAPI = {
  getLogs: async ({ endpointId, serviceId, limit = 50, page = 1 } = {}) => {
    const response = await apiClient.get(`/${LOGS_MODULE}`, {
      params: {
        ...(endpointId ? { endpointId } : {}),
        ...(serviceId ? { serviceId } : {}),
        limit,
        page,
      },
    });
    return response.data;
  },
};

export const alertChannelAPI = {
  getAlertChannels: async () => {
    const response = await apiClient.get(`/${ALERT_CHANNEL_MODULE}`);
    return response.data;
  },

  createAlertChannel: async (payload) => {
    const response = await apiClient.post(`/${ALERT_CHANNEL_MODULE}`, payload);
    return response.data;
  },

  deleteAlertChannel: async (id) => {
    const response = await apiClient.delete(`/${ALERT_CHANNEL_MODULE}/${id}`);
    return response.data;
  },
};