import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import sendResponse from "../../utils/ApiResponse.js";
import CatchAsync from "../../utils/CatchAsync.js";
import type {
  EndpointIdParams,
  GetEndpointTopLevelQueryInput,
  GetEndpointTimeseriesQueryInput,
} from "./metrics.validation.js";
import {
  getEndpointTimeseriesService,
  getEndpointTopLevelService,
} from "./metrics.service.js";

export const getEndpointTopLevel = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params as unknown as EndpointIdParams;
    const query = req.query as unknown as GetEndpointTopLevelQueryInput;
    const { userId, role } = req.user;

    const data = await getEndpointTopLevelService(
      {
        endpointId: id,
        ...query,
      },
      { userId, role }
    );

    sendResponse(res, StatusCodes.OK, "Endpoint top-level metrics fetched successfully", {
      metrics: data,
    });
  }
);

export const getEndpointTimeseries = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params as unknown as EndpointIdParams;
    const query = req.query as unknown as GetEndpointTimeseriesQueryInput;
    const { userId, role } = req.user;

    const data = await getEndpointTimeseriesService(
      {
        endpointId: id,
        ...query,
      },
      { userId, role }
    );

    sendResponse(res, StatusCodes.OK, "Endpoint time series fetched successfully", {
      metrics: data,
    });
  }
);
