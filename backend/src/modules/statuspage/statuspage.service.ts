import { StatusCodes } from "http-status-codes";
import slugify from "slugify";
import ApiError from "../../shared/utils/ApiError.js";
import { Statuspage } from "./statuspage.model.js";
import {
  CreateStatuspageInput,
  UpdateStatuspageInput,
} from "./statuspage.validation.js";
import { Service } from "../service/service.model.js";

//#region Helper Functions
const slugifyText = async (text: string) => {
  const baseSlug = slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = baseSlug;
  let counter = 2;

  while (await Statuspage.exists({ slug })) {
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
  const statuspage = await Statuspage.findOne({ slug, isPublic: true });

  if (!statuspage) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Statuspage not found");
  }

  return statuspage;
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
    const slug = await slugifyText(statuspageData.slug);
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
