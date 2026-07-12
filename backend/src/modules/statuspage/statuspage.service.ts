import { StatusCodes } from "http-status-codes";
import ApiError from "../../shared/utils/ApiError.js";
import { Statuspage } from "./statuspage.model.js";

export const getStatuspageService = async (statuspageId: string) => {

    const statuspage = await Statuspage.findById(statuspageId);

    if (!statuspage) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Statuspage not found"
        );
    }

    return statuspage;

};
