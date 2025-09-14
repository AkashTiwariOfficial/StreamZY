import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";
import { ApiResponses } from "../utils/ApiResponses.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const searchEngine = asyncHandler(async (req, res) => {

    const { page = 1, limit = 20, query, sortBy = "desc", sortType = "views" } = req.query

    const sort = {}

    const limitNumber = parseInt(limit, 10)
    const pageNumber = parseInt(page, 10)

    if (sortBy) {
        sort[sortBy] = sortType === "desc" ? -1 : 1;
    }

    const videoIndexing = await Video.collection.createIndex({ title: "text", description: "text", tag: "text" }, { weight: { title: 1000, descrption: 500, tag: 700 } })

    const videoResponse = await Video.find({ $text: { $search: query } }, { score: { $meta: "textScore" } })
        .sort(sort)
        .skip((pageNumber - 1) * 20)
        .limit(limitNumber)

    const user = await User.collection.createIndex({ username: "text", fullName: "text" }, { weight: { username: 10000, fullName: 5000 } })

    const userResponse = await User.find({ $text: { $search: query } }, { score: { $meta: "textScore" } })
        .sort(sort)
        .skip((pageNumber - 1) * 20)
        .limit(limitNumber)

    const combinedResponse = {
        videos: videoResponse,
        user: userResponse
    }

    return res
        .status(200)
        .json(new ApiResponses(200, combinedResponse, "succesfully fetched the user's query"))

})




export {
    searchEngine
}