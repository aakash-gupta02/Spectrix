import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/ApiError.js";
import { Incident } from "./incident.model.js";
import { EndpointDocument } from "../endpoint/endpoint.model.js";
import { Log } from "../log/log.model.js";


export const createIncident = async (endpoint: EndpointDocument, checkedAt: Date) => {

  const endpointDoc = endpoint as any;
  const endpointId = endpointDoc._id;

  return Incident.create({
    endpointId: endpointId,
    userId: endpoint.userId,
    startTime: checkedAt,
    status: "open"
  });
};

export const getOpenIncident = (endpointId: string) => {
  return Incident.findOne({ endpointId, status: "open" });
};

export const hasFailureStreak = async (endpointId: string, count = 3) => {
  const logs = await Log.find({ endpointId })
    .sort({ checkedAt: -1 })
    .limit(count);

  if (logs.length < count) return false;

  return logs.every(log => log.result === "failure");
};

export const incrementFailure = (incidentId: string) => {
  return Incident.updateOne(
    { _id: incidentId },
    { $inc: { failureCount: 1 } }
  );
};

export const resolveIncident = (incidentId: string, checkedAt: Date) => {
  return Incident.updateOne(
    { _id: incidentId },
    {
      status: "resolved",
      resolvedAt: checkedAt
    }
  );
};

export const handleIncidentService = async (endpoint: EndpointDocument, result: string, checkedAt: Date) => {

  const endpointDoc = endpoint as any;
  const endpointId = endpointDoc._id;

  const openIncident = await getOpenIncident(endpointId);

  const openIncidentDoc = openIncident as any;
  const openIncidentId = openIncidentDoc?._id;


  if (result === "failure") {
    if (!openIncident) {
      const hasStreak = await hasFailureStreak(endpointId, 3);

      if (hasStreak) {
        await createIncident(endpoint, checkedAt);
      }
    } else {
      await incrementFailure(openIncidentId);
    }
  }

  if (result === "success") {
    if (openIncident) {
      await resolveIncident(openIncidentId, checkedAt);
    }
  }
};

export const getIncidentsService = async (user: { userId: string, role: string }, query: { limit: number, page: number, endpointId?: string }) => {

  const filter: Record<string, unknown> = user.role === "admin" ? {} : { userId: user.userId };

  const { limit, page, endpointId } = query;
  const skip = (page - 1) * limit;

  if (endpointId) {
    filter.endpointId = endpointId;
  }

  const [total, incidents] = await Promise.all([
    Incident.countDocuments(filter),
    Incident.find(filter).sort({ checkedAt: -1 }).skip(skip).limit(limit)
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

export const getIncidentByIdService = async (incidentId: string, userId: string, role: string) => {
  const filter: Record<string, unknown> = role === "admin" ? {} : { userId: userId };

  const incident = await Incident.findOne({ _id: incidentId, ...filter });

  if (!incident) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Incident not found");
  }

  return incident;
};