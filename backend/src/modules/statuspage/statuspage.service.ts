import ApiError from "../../shared/utils/ApiError.js";
import { Statuspage } from "./statuspage.model.js";

export const getStatuspageService = async (id: string) => {

    const statuspage = await Statuspage.findById(id);

    if (!statuspage) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Statuspage not found"
        );
    }

    return statuspage;

};
