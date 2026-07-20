import { StatusCodes } from "http-status-codes";
import slugify from "slugify";
import ApiError from "../../shared/utils/ApiError.js";
import { Statuspage } from "./statuspage.model.js";
import {
  CreateStatuspageInput,
  UpdateStatuspageInput,
} from "./statuspage.validation.js";
import { Service } from "../service/service.model.js";
import { ServiceHistoryStatus } from "./statuspage.enum.js";
import { DailyStats } from "../stats/daily/endpointStats.model.js";
import { Types } from "mongoose";
import { Incident } from "../incident/incident.model.js";

//#region Helper Functions
const slugifyText = async (
  text: string,
  options: { excludeUserId?: string } = {},
) => {
  const baseSlug = slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = baseSlug;
  let counter = 2;

  while (
    await Statuspage.exists({
      slug,
      ...(options.excludeUserId
        ? { userId: { $ne: options.excludeUserId } }
        : {}),
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

const verifyServiceIdsExist = async (
  selectedServices: CreateStatuspageInput["serviceIds"],
  userId: string,
) => {
  const serviceIds = selectedServices.map(({ serviceId }) => serviceId);

  const existingServices = await Service.find({
    _id: { $in: serviceIds },
    userId,
  }).select("_id");

  if (existingServices.length !== selectedServices.length) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "One or more selected services are invalid.",
    );
  }
};

const getIncidentHistoryLookup = async (serviceIds: Types.ObjectId[]) => {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setHours(0, 0, 0, 0);
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 89);

  const incidents = await Incident.find({
    serviceId: { $in: serviceIds },
    startedAt: { $gte: ninetyDaysAgo },
    $or: [
      {
        resolvedAt: { $gte: ninetyDaysAgo },
      },
      {
        status: "open",
      },
    ],
  })
    .select("_id serviceId startedAt resolvedAt publicStatus")
    .lean();

  const lookup = new Map<
    string,
    {
      id: string;
      publicStatus: string;
      startedAt: Date;
      resolvedAt: Date | null;
    }
  >();

  for (const incident of incidents) {
    const current = new Date(incident.startedAt);
    current.setHours(0, 0, 0, 0);

    const end = incident.resolvedAt
      ? new Date(incident.resolvedAt)
      : new Date();

    end.setHours(0, 0, 0, 0);

    while (current <= end) {
      const key = `${incident.serviceId?.toString() ?? ""}-${current
        .toISOString()
        .slice(0, 10)}`;

      lookup.set(key, {
        id: incident._id.toString(),
        publicStatus: incident.publicStatus,
        startedAt: incident.startedAt,
        resolvedAt: incident.resolvedAt ?? null,
      });

      current.setDate(current.getDate() + 1);
    }
  }

  return lookup;
};

const getServiceHistoryStatus = (
  uptime: number | null,
): ServiceHistoryStatus => {
  if (uptime === null) {
    return ServiceHistoryStatus.NO_DATA;
  }

  if (uptime === 100) {
    return ServiceHistoryStatus.OPERATIONAL;
  }

  if (uptime >= 99) {
    return ServiceHistoryStatus.DEGRADED;
  }

  if (uptime >= 95) {
    return ServiceHistoryStatus.PARTIAL_OUTAGE;
  }

  return ServiceHistoryStatus.MAJOR_OUTAGE;
};

const getServiceStatusHistory = async (serviceIds: Types.ObjectId[]) => {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setHours(0, 0, 0, 0);
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 89);

  const dailyStats = await DailyStats.aggregate([
    {
      $match: {
        serviceId: {
          $in: serviceIds,
        },
        date: {
          $gte: ninetyDaysAgo,
        },
      },
    },

    {
      $group: {
        _id: {
          serviceId: "$serviceId",
          date: "$date",
        },

        totalRequests: {
          $sum: "$totalRequests",
        },

        successRequests: {
          $sum: "$successRequests",
        },
      },
    },

    {
      $project: {
        _id: 0,
        serviceId: "$_id.serviceId",
        date: "$_id.date",

        uptime: {
          $cond: [
            {
              $eq: ["$totalRequests", 0],
            },
            null,
            {
              $multiply: [
                {
                  $divide: ["$successRequests", "$totalRequests"],
                },
                100,
              ],
            },
          ],
        },
      },
    },
  ]);

  const lookup = new Map();

  for (const stat of dailyStats) {
    lookup.set(
      `${stat.serviceId.toString()}-${stat.date.toISOString().slice(0, 10)}`,
      stat.uptime,
    );
  }

  const incidentLookup = await getIncidentHistoryLookup(serviceIds);

  return serviceIds.map((serviceId) => {
    const history = [];

    for (let i = 89; i >= 0; i--) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);

      const key = `${serviceId.toString()}-${date.toISOString().slice(0, 10)}`;

      const uptime = lookup.get(key) ?? null;

      history.push({
        date,
        uptime,
        status: getServiceHistoryStatus(uptime),
        incident: incidentLookup.get(key) ?? null,
      });
    }

    return {
      serviceId,
      history,
    };
  });
};

const getActiveIncidents = async (serviceIds: Types.ObjectId[]) => {
  const incidents = await Incident.find({
    serviceId: { $in: serviceIds },
    status: "open",
  })
    .populate("serviceId", "name")
    .populate("endpointId", "name path")
    .sort({ startedAt: -1 })
    .lean();

  return incidents;
};

const getIncidentServiceId = (serviceId: unknown): string => {
  if (!serviceId) return "";

  if (typeof serviceId === "object" && serviceId !== null && "_id" in serviceId) {
    return String((serviceId as { _id: Types.ObjectId })._id);
  }

  return String(serviceId);
};
// #endregion

// get statuspage by User ID
export const getStatuspageService = async (userId: string) => {
  const statuspage = await Statuspage.findOne({ userId });

  if (!statuspage) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Statuspage not found");
  }

  return statuspage;
};

// get statuspage by slug
export const getStatuspageBySlugService = async (slug: string) => {
  const statuspage = await Statuspage.findOne({
    slug,
    isPublic: true,
  })
    .populate("serviceIds.serviceId")
    .lean();

  if (!statuspage) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Status page not found");
  }

  // get service status history
  const history = await getServiceStatusHistory(
    statuspage.serviceIds.map((s) => s.serviceId._id),
  );

  // get active incidents
  const activeIncidents = await getActiveIncidents(
    statuspage.serviceIds.map((s) => s.serviceId._id),
  );

  // get services with status history and active incident
  const services = statuspage.serviceIds.map((service) => {
    const serviceId = service.serviceId._id.toString();

    return {
      ...service.serviceId,
      order: service.order,

      history:
        history.find((h) => h.serviceId.toString() === serviceId)?.history ??
        [],

      activeIncident:
        activeIncidents.find(
          (incident) => getIncidentServiceId(incident.serviceId) === serviceId,
        ) ?? null,
    };
  });

  // return statuspage without serviceIds
  const statuspageObject = statuspage;
  const { serviceIds, ...statuspageData } = statuspageObject;

  return {
    ...statuspageData,
    services,
  };
};

// create a  statuspage
export const createStatuspageService = async (
  statuspageData: CreateStatuspageInput,
  userId: string,
) => {
  const slug = await slugifyText(statuspageData.name);

  await verifyServiceIdsExist(statuspageData.serviceIds, userId);

  const statuspage = await Statuspage.create({
    ...statuspageData,
    slug,
    userId,
  });

  return statuspage;
};

// update a statuspage
export const updateStatuspageService = async (
  statuspageData: UpdateStatuspageInput,
  userId: string,
) => {
  if (statuspageData.slug) {
    const slug = await slugifyText(statuspageData.slug, {
      excludeUserId: userId,
    });
    statuspageData.slug = slug;
  }

  if (statuspageData.serviceIds) {
    await verifyServiceIdsExist(statuspageData.serviceIds, userId);
  }

  const statuspage = await Statuspage.findOneAndUpdate(
    { userId },
    { ...statuspageData },
    { new: true, runValidators: true },
  );

  if (!statuspage) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Statuspage not found");
  }

  return statuspage;
};

// delete a statuspage
export const deleteStatuspageService = async (userId: string) => {
  const statuspage = await Statuspage.findOneAndDelete({ userId });

  if (!statuspage) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Statuspage not found");
  }

  return statuspage;
};
