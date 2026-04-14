import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/ApiError.js";
import { Incident } from "./incident.model.js";
import { Log } from "../log/log.model.js";
import { triggerAlert } from "../alert/alert.service.js";
import { EndpointWithService } from "../alert/alert.formatter.js";
import type { Types } from "mongoose";

export const createIncident = async (
  endpoint: EndpointWithService,
  checkedAt: Date,
) => {
  const endpointId = endpoint._id;
  const serviceId = endpoint.serviceId._id;

  await triggerAlert({
    type: "incident_created",
    endpoint,
  });

  return Incident.create({
    endpointId: endpointId,
    serviceId: serviceId,
    userId: endpoint.userId,
    startedAt: checkedAt,
    status: "open",
  });
};

export const getOpenIncident = (endpointId: string | Types.ObjectId) => {
  return Incident.findOne({ endpointId, status: "open" });
};

export const hasFailureStreak = async (
  endpointId: string | Types.ObjectId,
  count = 3,
) => {
  const logs = await Log.find({ endpointId })
    .sort({ checkedAt: -1 })
    .limit(count);

  if (logs.length < count) return false;

  return logs.every((log) => log.result === "failure");
};

export const incrementFailure = (incidentId: string) => {
  return Incident.updateOne({ _id: incidentId }, { $inc: { failureCount: 1 } });
};

export const resolveIncident = async (
  incidentId: string,
  checkedAt: Date,
  endpoint: EndpointWithService,
) => {
  const resolvedIncident = await Incident.updateOne(
    { _id: incidentId },

    {
      status: "resolved",
      resolvedAt: checkedAt,
    },
  );

  await triggerAlert({
    type: "incident_resolved",
    endpoint: endpoint,
  });
  
  return resolvedIncident;
};

export const handleIncidentService = async (
  endpoint: EndpointWithService,
  result: string,
  checkedAt: Date,
) => {
  const endpointId = endpoint._id;

  const openIncident = await getOpenIncident(endpointId);

  const openIncidentId = openIncident?._id;

  if (result === "failure") {
    if (!openIncident) {
      const hasStreak = await hasFailureStreak(endpointId, 3);

      if (hasStreak) {
        await createIncident(endpoint, checkedAt);
      }
    } else {
      await incrementFailure(String(openIncidentId));
    }
  }

  if (result === "success") {
    if (openIncident) {
      await resolveIncident(String(openIncidentId), checkedAt, endpoint);
    }
  }
};

export const getIncidentsService = async (
  user: { userId: string; role: string },
  query: {
    limit: number;
    page: number;
    endpointId?: string;
    serviceId?: string;
  },
) => {
  const filter: Record<string, unknown> =
    user.role === "admin" ? {} : { userId: user.userId };

  const { limit, page, endpointId, serviceId } = query;
  const skip = (page - 1) * limit;

  if (endpointId) {
    filter.endpointId = endpointId;
  }

  if (serviceId) {
    filter.serviceId = serviceId;
  }

  const [total, incidents] = await Promise.all([
    Incident.countDocuments(filter),
    Incident.find(filter)
      .sort({ checkedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("endpointId", "name method path")
      .populate("serviceId", "name environment"),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    incidents,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      hasNextPage: query.page < totalPages,
      hasPreviousPage: query.page > 1,
    },
  };
};

export const getIncidentByIdService = async (
  incidentId: string,
  userId: string,
  role: string,
) => {
  const filter: Record<string, unknown> =
    role === "admin" ? {} : { userId: userId };

  const incident = await Incident.findOne({ _id: incidentId, ...filter });

  if (!incident) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Incident not found");
  }

  return incident;
};
