import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";
import { ApiResponses } from "../utils/ApiResponses.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const searchEngine = asyncHandler(async (req, res) => {

    const { page = 1, limit = 10, query, sortBy = "desc", sortType = "views" } = req.query

    const limitNumber = parseInt(limit, 10);
    const pageNumber = parseInt(page, 10);

    const videoIndexing = await Video.collection.createIndex({ title: "text", description: "text", tag: "text" }, { weight: { title: 1000, descrption: 500, tag: 700 } })

    const videoResponse = await Video.find({ $text: { $search: query } }, { score: { $meta: "textScore" } })
        .sort({
            [sortBy]: sortType === "desc" ? -1 : 1,
            _id: -1
        })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .populate("owner", "username avatar")

    const user = await User.collection.createIndex({ username: "text", fullName: "text" }, { weight: { username: 10000, fullName: 5000 } })

    const userResponse = await User.aggregate([
        {
            $match: {
                $text: { $search: query },
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribedTo: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $lookup: {
                from: "videos",
                foreignField: "owner",
                localField: "_id",
                as: "videos",
            }
        },
        {
            $addFields: {
                totalVideo: {
                    $size: "$videos"
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                avatar: 1,
                createdAt: 1,
                subscribersCount: 1,
                totalVideo: 1,
                score: { $meta: "textScore" }
            }
        },
        {
            $sort: {
                score: 1
            }
        }
    ])
        .sort({
            [sortBy]: sortType === "desc" ? -1 : 1,
            _id: -1
        })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)

    const totalVideoResponses = await Video.find({ $text: { $search: query } }, { score: { $meta: "textScore" } });
    const totalUserResponse = await User.find(
        {
            $text: { $search: query }
        });

    const totalResults = totalUserResponse.length + totalVideoResponses.length;

    const combinedResponse = {
        videos: videoResponse,
        user: userResponse,
        totalResults: totalResults
    }

    return res
        .status(200)
        .json(new ApiResponses(200, combinedResponse, "succesfully fetched the user's query"))

})




export {
    searchEngine
}