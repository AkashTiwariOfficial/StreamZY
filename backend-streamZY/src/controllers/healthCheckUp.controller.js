import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponses } from "../utils/ApiResponses.js";
import { ApiErrors } from "../utils/ApiErrors.js";




const healthCheckup = asyncHandler(async (req, res) => {

    try {
        return res
            .status(200)
            .json(new ApiResponses(200, {}, "Ok"))
    } catch (error) {
        throw new ApiErrors(500, "Internal Server Error")
    }

})


export {

healthCheckup

}