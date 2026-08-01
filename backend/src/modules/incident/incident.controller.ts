import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import sendResponse from "../../shared/utils/ApiResponse.js";
import CatchAsync from "../../shared/utils/CatchAsync.js";

import { getIncidentsService, getIncidentByIdService, updateIncidentService } from "./incident.service.js";
import type { GetIncidentsQuery, IncidentIdParams } from "./incident.validation.js";

// Get all incidents
export const getIncidents = CatchAsync(async (req: Request, res: Response) => {
    const { userId, role } = req.user;
    const query = req.query as unknown as GetIncidentsQuery;

    const incidents = await getIncidentsService({ userId, role }, query);

    sendResponse(res, StatusCodes.OK, "Incidents retrieved successfully", { incidents });
});

// Get incident by ID
export const getIncidentById = CatchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as unknown as IncidentIdParams;
    const { userId, role } = req.user;

    const incident = await getIncidentByIdService(id, userId, role);

    sendResponse(res, StatusCodes.OK, "Incident retrieved successfully", { incident });
});

// Update incident by ID
export const updateIncidentById = CatchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as unknown as IncidentIdParams;
    const { userId, role } = req.user;
    const updateData = req.body;

    const updatedIncident = await updateIncidentService(id, userId, role, updateData);

    sendResponse(res, StatusCodes.OK, "Incident updated successfully", { incident: updatedIncident });
});