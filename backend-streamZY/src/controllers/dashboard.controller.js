import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponses } from "../utils/ApiResponses.js";
import { Video } from "../models/video.models.js";
import { Like } from "../models/like.models.js";
import { Subscription } from "../models/subscription.models.js";




const channelStats = asyncHandler(async (req, res) => {

  try {
    const Videos = await Video.find({
      owner: req.user?._id
    })

    const totalVideos = Videos.length;

    let finalViews = 0, totalLikes = 0;

    const totalViewsAndLikes = await Promise.all(Videos.map(async (video) => {

      finalViews = finalViews + video.views;

      const Likes = await Like.find({
        video: video?._id,
        isVideoLiked: true
      })

      totalLikes = totalLikes + Likes.length;

    }))

    const subscribers = await Subscription.find({
      channel: req.user?._id,
      isSubscribed: true
    })

    const totalSubscribers = subscribers.length;

    return res
      .status(200)
      .json(new ApiResponses(200, { totalVideos, finalViews, totalLikes, totalSubscribers }, "Channel Stats fetched successfully"))
  } catch (error) {
    throw new ApiErrors(500, `Internal Server Error : ${error.message}`);
  }

})


const getChannelVideos = asyncHandler(async (req, res) => {

  try {
    const totalVideos = await Video.find({
      owner: req.user?._id
    })

    return res
      .status(200)
      .json(new ApiResponses(200, totalVideos, "Videos of channel fetched successfully"))
  } catch (error) {
    throw new ApiErrors(500, "Internal Server Error");
  }

})




export {

  channelStats,
  getChannelVideos

}