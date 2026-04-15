import { StatusCodes } from "http-status-codes";
import ApiError from "../../../utils/ApiError.js";
import type { Types } from "mongoose";
import AlertChannel from "./alertChannel.model.js";
import { CreateAlertChannelInput } from "./alertChannel.validation.js";
import { encrypt } from "../../../utils/encryption/encryption.js";
import { env } from "../../../config/env.js";
import { sendByType } from "../alert.service.js";

// version for encryption & decryption
const version = env.CURRENT_KEY_VERSION;

export const createAlertChannelService = async (
  userId: Types.ObjectId | string,
  data: CreateAlertChannelInput,
) => {
  const { type, url, isActive } = data;

  // Check if user already has a channel of this type
  const existingChannel = await AlertChannel.findOne({ userId, type });
  if (existingChannel) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Alert channel of type '${type}' already exists`,
    );
  }

  await sendByType({
    type,
    url,
    message:
      "This is a test message to validate your alert channel configuration.",
  });

  // Encrypt the URL before saving
  const encryptedUrl = encrypt(url, version);

  // Create and save the alert channel
  const alertChannel = new AlertChannel({
    userId,
    type,
    url: encryptedUrl,
    keyVersion: version,
    isActive: isActive ?? true,
  });
  await alertChannel.save();

  return alertChannel;
};
