import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { Video } from "../models/video.models.js";
import { Tweet } from "../models/tweet.models.js";
import { Like } from "../models/like.models.js";
import { Comment } from "../models/comment.models.js"
import { ApiResponses } from "../utils/ApiResponses.js";





const toggleUserVideoLike = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    if (!videoId) {
        throw new ApiErrors(400, "videoId is missing!")
    }

    try {
        const validId = await Video.findById(videoId)

        if (!validId) {
            throw new ApiErrors(404, "Video not found!")
        }

        let likeVideo, toggleVideoLike;

        const isLikedByUser = await Like.findOne({
            video: videoId,
            likedBy: req.user?._id,
        })

        if (isLikedByUser) {
            if (isLikedByUser?.isVideoLiked == true) {
            toggleVideoLike = await Like.findByIdAndUpdate(isLikedByUser?._id, {
                $set: {
                    isVideoLiked: false
                }
            }, { new: true })

            if (!toggleVideoLike) {
                throw new ApiErrors(500, "Internal Server Error while toggling Video like")
            }
        }
          if (isLikedByUser?.isVideoLiked == false) {
            toggleVideoLike = await Like.findByIdAndUpdate(isLikedByUser?._id, {
                $set: {
                    isVideoLiked: true
                }
            }, { new: true })

            if (!toggleVideoLike) {
                throw new ApiErrors(500, "Internal Server Error while toggling Video like")
            }
        }
    }

        if (!isLikedByUser) {
            likeVideo = await Like.create({
                video: videoId,
                likedBy: req.user?._id,
                isVideoLiked: true
            })

            if (!likeVideo) {
                throw new ApiErrors(500, "Internal Server Error while liking Video")
            }
        }

        return res
            .status(200)
            .json(new ApiResponses(200, { toggleVideoLike, likeVideo }, "Video liked successfully"))
    } catch (error) {
        throw new ApiErrors(500, `Internal Server Error : ${error.message} `)
    }

})


const toggleUserTweetLike = asyncHandler(async (req, res) => {

    const { tweetId } = req.params

    if (!tweetId) {
        throw new ApiErrors(400, "tweetId is missing!")
    }

    try {
        const validId = await Tweet.findById(tweetId)

        if (!validId) {
            throw new ApiErrors(404, "Tweet not found!")
        }

        let likeTweet, toggleTweetLike;

        const isLikedByUser = await Like.findOne({
            tweet: tweetId,
            likedBy: req.user?._id,
        })

        if (isLikedByUser) {
            if (isLikedByUser?.isTweetLiked == true) {
                toggleTweetLike = await Like.findByIdAndUpdate(isLikedByUser?._id, {
                    $set: {
                        isTweetLiked: false
                    }
                }, { new: true })

                if (!toggleTweetLike) {
                    throw new ApiErrors(500, "Internal Server Error while toggling Tweet like")
                }
            }
            if (isLikedByUser?.isTweetLiked == false) {
                toggleTweetLike = await Like.findByIdAndUpdate(isLikedByUser?._id, {
                    $set: {
                        isTweetLiked: true
                    }
                }, { new: true })

                if (!toggleTweetLike) {
                    throw new ApiErrors(500, "Internal Server Error while toggling Tweet like")
                }
            }
        }

        if (!isLikedByUser) {
            likeTweet = await Like.create({
                tweet: tweetId,
                likedBy: req.user?._id,
                isTweetLiked: true
            })

            if (!likeTweet) {
                throw new ApiErrors(500, "Internal Server Error while liking Tweet")
            }
        }

        return res
            .status(200)
            .json(new ApiResponses(200, { toggleTweetLike, likeTweet }, "Tweet liked successfully"))
    } catch (error) {
        throw new ApiErrors(500, `Internal Server Error : ${error.message} `)
    }

})


const toggleUserCommentLike = asyncHandler(async (req, res) => {

    const { commentId } = req.params

    if (!commentId) {
        throw new ApiErrors(400, "commentId is missing!")
    }

    try {
        const validId = await Comment.findById(commentId)

        if (!validId) {
            throw new ApiErrors(404, "comment not found!")
        }

        let likeComment, toggleCommentLike;

        const isLikedByUser = await Like.findOne({
            comment: commentId,
            likedBy: req.user?._id,
        })

        if (isLikedByUser) {
            if (isLikedByUser?.isCommentLiked == true) {
                toggleCommentLike = await Like.findByIdAndUpdate(isLikedByUser?._id, {
                    $set: {
                        isCommentLiked: false
                    }
                }, { new: true })

                if (!toggleCommentLike) {
                    throw new ApiErrors(500, "Internal Server Error while toggling Comment like")
                }
            }

            if (isLikedByUser?.isCommentLiked == false) {
                toggleCommentLike = await Like.findByIdAndUpdate(isLikedByUser?._id, {
                    $set: {
                        isCommentLiked: true
                    }
                }, { new: true })

                if (!toggleCommentLike) {
                    throw new ApiErrors(500, "Internal Server Error while toggling Comment like")
                }
            }
        }

        if (!isLikedByUser) {
            likeComment = await Like.create({
                comment: commentId,
                likedBy: req.user?._id,
                isCommentLiked: true
            })

            if (!likeComment) {
                throw new ApiErrors(500, "Internal Server Error while liking Comment")
            }
        }

        return res
            .status(200)
            .json(new ApiResponses(200, { toggleCommentLike, likeComment }, "Comment liked successfully"))
    } catch (error) {
        throw new ApiErrors(500, `Internal Server Error : ${error.message} `)
    }

})


const getLikedVideos = asyncHandler(async (req, res) => {

    const userLikedVideos = await Like.find({
        likedBy: req.user?._id,
        isVideoLiked: true
    })

    if (!userLikedVideos) {
        throw new ApiErrors(500, "Internal Server Error while fetching user's liked Video")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, userLikedVideos, "User's liked videos fetched successfully"))

})



const isVideoLiked = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    if (!videoId) {
        throw new ApiErrors(400, "videoId is missing!")
    }

    let isLiked;

    try {

        const validId = await Video.findById(videoId)

        if (!validId) {
            throw new ApiErrors(404, "Video not found!")
        }

        const userLiked = await Like.findOne({
            likedBy: req.user?._id,
            video: videoId,
            isVideoLiked: true
        })

        if (userLiked) {
            isLiked = true;
        }

        if (!userLiked) {
            isLiked = false;
        }

    } catch (error) {
        throw new ApiErrors(500, `Internal Server Error : ${error.message} `)
    }
    return res
        .status(200)
        .json(new ApiResponses(200, isLiked, "User's liked videos fetched successfully"))

})


const userCommentLike = asyncHandler(async (req, res) => {

    const { commentId } = req.params

    if (!commentId) {
        throw new ApiErrors(400, "commentId is missing!")
    }

    let isLiked;

    try {
        const validId = await Comment.findById(commentId)

        if (!validId) {
            throw new ApiErrors(404, "comment not found!")
        }

        const isLikedByUser = await Like.findOne({
            comment: commentId,
            likedBy: req.user?._id,
            isCommentLiked: true
        })

        if (isLikedByUser) {
            isLiked = true;
        }

        if (!isLikedByUser) {
            isLiked = false;
        }

    } catch (error) {
        throw new ApiErrors(500, `Internal Server Error : ${error.message} `)
    }

    return res
        .status(200)
        .json(new ApiResponses(200, isLiked, "Comment liked successfully"))

})

export {

    toggleUserVideoLike,
    toggleUserTweetLike,
    toggleUserCommentLike,
    getLikedVideos,
    userCommentLike,
    isVideoLiked,

}