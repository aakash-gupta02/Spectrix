import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/ApiError.js";
import { CreateStreamInput, UpdateStreamInput } from "./stream.validation.js";
import { Stream } from "./stream.model.js";
import crypto from "crypto";
import { env } from "../../config/env.js";
import { getKey } from "../../utils/encryption/keyManager.js";
import { Service } from "../service/service.model.js";

export const generateStreamKey = () => {
  // secure random token
  const random = crypto.randomBytes(24).toString("hex");

  // get current key version and key
  const version = env.CURRENT_KEY_VERSION;
  const key = getKey(version);

  // full key
  const rawKey = `spx_${version}_live_${random}`;

  // hash for DB storage
  const keyHash = crypto.createHmac("sha256", key).update(rawKey).digest("hex");

  // preview for UI
  const keyPreview = rawKey.slice(0, 12) + "****" + rawKey.slice(-4);

  return {
    rawKey,
    keyHash,
    keyPreview,
    version,
  };
};

// Stream service functions
export const createStreamService = async (
  payload: CreateStreamInput,
  userId: string,
) => {
  const { name, serviceId } = payload;

  // Verify service ownership
  const service = await Service.exists({
    _id: serviceId,
    userId,
  });

  if (!service) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Service not found");
  }

  // Prevent duplicate stream keys for same service
  const existingStream = await Stream.exists({
    userId,
    serviceId,
  });

  if (existingStream) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "API Key for this service already exists",
    );
  }

  // Generate secure stream key
  const { rawKey, keyHash, keyPreview, version } = generateStreamKey();

  try {
    const stream = new Stream({
      userId,
      name,
      serviceId,
      keyHash,
      keyPreview,
      keyVersion: version,
    });

    await stream.save();

    return {
      stream: stream.toObject(),
      rawKey, // returned only once
    };
  } catch (error: any) {
    // Fallback protection against race conditions
    if (error.code === 11000) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "API Key for this service already exists",
      );
    }

    throw error;
  }
};

// Get Streams Service
export const getAllStreamService = async (userId: string) => {
  const streams = await Stream.find({ userId }).lean();
  return streams;
};

// Get Stream by ID Service
export const getStreamByIdService = async (streamId: string, userId: string) => {
  const stream = await Stream.findOne({
    _id: streamId,
    userId,
  }).lean();

  if (!stream) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Stream not found");
  }

  return stream;
};

// Delete Stream Service
export const deleteStreamService = async (streamId: string, userId: string) => {
  const stream = await Stream.findOneAndDelete({
    _id: streamId,
    userId,
  });
  if (!stream) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Stream not found");
  }
  return stream;
};

// Update Stream Service
export const updateStreamService = async (
  streamId: string,
  userId: string,
  updateData: UpdateStreamInput,
) => {
  const stream = await Stream.findOneAndUpdate(
    { _id: streamId, userId },
    { $set: updateData },
    { new: true },
  ).lean();
  if (!stream) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Stream not found");
  }
  return stream;
};
