import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { Video } from "../models/video.models.js";
import { Tweet } from "../models/tweet.models.js";
import { Like } from "../models/like.models.js";
import { Comment } from "../models/comment.models.js"
import { ApiResponses } from "../utils/ApiResponses.js";
import { ReplyComment } from "../models/replyComment.models.js";




const getLikedVideos = asyncHandler(async (req, res) => {

    const likedVideo = await Like.aggregate([
        {
            $match: {
                likedBy: req.user?._id,
                isVideoLiked: true
            }
        },
        {
            $lookup: {
                from: "videos",
                foreignField: "_id",
                localField: "video",
                as: "video",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            foreignField: "_id",
                            localField: "owner",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        fullName: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            },
        },
        {
            $addFields: {
                video: {
                    $first: "$video"
                }
            }
        }
    ])

       if (!likedVideo) {
        throw new ApiErrors(500, "Internal Server Error while fetching user's liked Video")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, likedVideo, "User's liked videos fetched successfully"))

})

const removeFromLike = asyncHandler( async (req, res) => {
       const { Id } = req.params

    if (!Id) {
        throw new ApiErrors(400, "videoId is missing!")
    }

    try {

        const id = await Like.findById(Id);
        if (!id) {
            throw new ApiErrors(404, "Not found!");
        }
        const validId = await Like.findByIdAndDelete(Id);

        if (!validId) {
            throw new ApiErrors(500, "Internal Server Error while deleting Liked Video!");
        }

      return res
            .status(200)
            .json(new ApiResponses(200, validId, "Video liked deleted successfully"))
    } catch (error) {
        throw new ApiErrors(500, `Internal Server Error : ${error.message} `);
    }


})

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
            } if (isLikedByUser?.isVideoDisLiked == true) {
                toggleVideoLike = await Like.findByIdAndUpdate(isLikedByUser?._id, {
                    $set: {
                        isVideoLiked: true,
                        isVideoDisLiked: false
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
            if (isLikedByUser?.isCommentDisLiked == true) {
                toggleCommentLike = await Like.findByIdAndUpdate(isLikedByUser?._id, {
                    $set: {
                        isCommentLiked: true,
                        isCommentDisLiked: false
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


const getLikedVideoss = asyncHandler(async (req, res) => {

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

        let dislike;

        const userDisLiked = await Like.findOne({
            likedBy: req.user?._id,
            video: videoId,
            isVideoDisLiked: true
        })


        if (userDisLiked) {
            dislike = true;
        }

        if (!userDisLiked) {
            dislike = false;
        }

        return res
            .status(200)
            .json(new ApiResponses(200, { isLiked, dislike }, "User's liked videos fetched successfully"))

    } catch (error) {
        throw new ApiErrors(500, `Internal Server Error : ${error.message} `)
    }
})


const userCommentLike = asyncHandler(async (req, res) => {

    const { commentId } = req.params

    if (!commentId) {
        throw new ApiErrors(400, "commentId is missing!")
    }

    let isLiked;

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

    let dislike;

    const isDisLikedByUser = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id,
        isCommentDisLiked: true
    })

    if (isDisLikedByUser) {
        dislike = true;
    }

    if (!isDisLikedByUser) {
        dislike = false;
    }

    return res
        .status(200)
        .json(new ApiResponses(200, { isLiked, dislike }, "Comment liked successfully"))

})


const totalLikes = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    if (!videoId) {
        throw new ApiErrors(400, "videoId is missing!")
    }

    const validId = await Video.findById(videoId)

    if (!validId) {
        throw new ApiErrors(404, "Video not found!")
    }

    const totalVideoLikes = await Like.find({
        video: videoId,
        isVideoLiked: true
    })

    if (!totalVideoLikes) {
        throw new ApiErrors(500, "Internal Server Error while fetching user's liked Video")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, totalVideoLikes, "Video's liked videos fetched successfully"))

})


const totalCommentLike = asyncHandler(async (req, res) => {

    const { commentId } = req.params

    if (!commentId) {
        throw new ApiErrors(400, "commentId is missing!")
    }

    const validId = await Comment.findById(commentId)

    if (!validId) {
        throw new ApiErrors(404, "comment not found!")
    }

    const likes = await Like.find({
        comment: commentId,
        isCommentLiked: true
    })

    if (!likes) {
        throw new ApiErrors(500, "Internal Server Error while fetching user's liked Video")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, likes, "Comment's liked successfully fetched"))

})


const toggleLikeAndDisLike = asyncHandler(async (req, res) => {

    const { videoId } = req.params


    if (!videoId) {
        throw new ApiErrors(400, "videoId is missing!")
    }

    try {

        const validId = await Video.findById(videoId)

        if (!validId) {
            throw new ApiErrors(404, "Video not found!")
        }

        let dislikeVideo, toggleVideoLike;

        const isLikedByUser = await Like.findOne({
            video: videoId,
            likedBy: req.user?._id,
        })

        if (isLikedByUser) {
            if (isLikedByUser?.isVideoLiked == true) {
                toggleVideoLike = await Like.findByIdAndUpdate(isLikedByUser?._id, {
                    $set: {
                        isVideoLiked: false,
                        isVideoDisLiked: true
                    }
                }, { new: true })

                if (!toggleVideoLike) {
                    throw new ApiErrors(500, "Internal Server Error while toggling Video like")
                }
            }
            if (isLikedByUser?.isVideoDisLiked == true) {
                toggleVideoLike = await Like.findByIdAndUpdate(isLikedByUser?._id, {
                    $set: {
                        isVideoDisLiked: false
                    }
                }, { new: true })

                if (!toggleVideoLike) {
                    throw new ApiErrors(500, "Internal Server Error while toggling Video like")
                }
            }
            if (isLikedByUser?.isVideoDisLiked == false) {
                toggleVideoLike = await Like.findByIdAndUpdate(isLikedByUser?._id, {
                    $set: {
                        isVideoDisLiked: true
                    }
                }, { new: true })

                if (!toggleVideoLike) {
                    throw new ApiErrors(500, "Internal Server Error while toggling Video like")
                }
            }
        }

        if (!isLikedByUser) {
            dislikeVideo = await Like.create({
                video: videoId,
                likedBy: req.user?._id,
                isVideoDisLiked: true
            })

            if (!dislikeVideo) {
                throw new ApiErrors(500, "Internal Server Error while liking Video")
            }
        }

        return res
            .status(200)
            .json(new ApiResponses(200, { toggleVideoLike, dislikeVideo }, "Video liked successfully"))
    } catch (error) {
        throw new ApiErrors(500, `Internal Server Error : ${error.message} `)
    }

})


const toggleLikeAndDisLikeComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params

    if (!commentId) {
        throw new ApiErrors(400, "commentId is missing!")
    }

    try {
        const validId = await Comment.findById(commentId)

        if (!validId) {
            throw new ApiErrors(404, "comment not found!")
        }

        let dislikeComment, toggleCommentLike;

        const isLikedByUser = await Like.findOne({
            comment: commentId,
            likedBy: req.user?._id,
        })

        if (isLikedByUser) {
            if (isLikedByUser?.isCommentLiked == true) {
                toggleCommentLike = await Like.findByIdAndUpdate(isLikedByUser?._id, {
                    $set: {
                        isCommentLiked: false,
                        isCommentDisLiked: true
                    }
                }, { new: true })

                if (!toggleCommentLike) {
                    throw new ApiErrors(500, "Internal Server Error while toggling Comment like")
                }
            }

            if (isLikedByUser?.isCommentDisLiked == false) {
                toggleCommentLike = await Like.findByIdAndUpdate(isLikedByUser?._id, {
                    $set: {
                        isCommentDisLiked: true
                    }
                }, { new: true })

                if (!toggleCommentLike) {
                    throw new ApiErrors(500, "Internal Server Error while toggling Comment like")
                }
            }
            if (isLikedByUser?.isCommentDisLiked == true) {
                toggleCommentLike = await Like.findByIdAndUpdate(isLikedByUser?._id, {
                    $set: {
                        isCommentDisLiked: false
                    }
                }, { new: true })

                if (!toggleCommentLike) {
                    throw new ApiErrors(500, "Internal Server Error while toggling Comment like")
                }
            }
        }

        if (!isLikedByUser) {
            dislikeComment = await Like.create({
                comment: commentId,
                likedBy: req.user?._id,
                isCommentDisLiked: true
            })

            if (!dislikeComment) {
                throw new ApiErrors(500, "Internal Server Error while liking Comment")
            }
        }

        return res
            .status(200)
            .json(new ApiResponses(200, { toggleCommentLike, dislikeComment }, "Comment liked successfully"))
    } catch (error) {
        throw new ApiErrors(500, `Internal Server Error : ${error.message} `)
    }

})


const totalReplyCommentLike = asyncHandler(async (req, res) => {

    const { replyCommentId } = req.params

    if (!replyCommentId) {
        throw new ApiErrors(400, "commentId is missing!")
    }

    const validId = await ReplyComment.findById(replyCommentId)

    if (!validId) {
        throw new ApiErrors(404, "comment not found!")
    }

    const likes = await Like.find({
        replyComment: replyCommentId,
        isReplyLiked: true
    })

    if (!likes) {
        throw new ApiErrors(500, "Internal Server Error while fetching user's liked Video")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, likes, "Comment's liked successfully fetched"))

})


const toggleReplyCommentLike = asyncHandler(async (req, res) => {

    const { replyCommentId } = req.params

    if (!replyCommentId) {
        throw new ApiErrors(400, "commentId is missing!")
    }

    try {
        const validId = await ReplyComment.findById(replyCommentId)

        if (!validId) {
            throw new ApiErrors(404, "comment not found!")
        }

        let likeComment, toggleCommentLike;

        const isLikedByUser = await Like.findOne({
            replyComment: replyCommentId,
            likedBy: req.user?._id,
        })

        if (isLikedByUser) {
            if (isLikedByUser?.isReplyLiked == true) {
                toggleCommentLike = await Like.findByIdAndUpdate(isLikedByUser?._id, {
                    $set: {
                        isReplyLiked: false
                    }
                }, { new: true })

                if (!toggleCommentLike) {
                    throw new ApiErrors(500, "Internal Server Error while toggling Comment like")
                }
            }

            if (isLikedByUser?.isReplyLiked == false) {
                toggleCommentLike = await Like.findByIdAndUpdate(isLikedByUser?._id, {
                    $set: {
                        isReplyLiked: true
                    }
                }, { new: true })

                if (!toggleCommentLike) {
                    throw new ApiErrors(500, "Internal Server Error while toggling Comment like")
                }
            }
            if (isLikedByUser?.isReplyDisLiked == true) {
                toggleCommentLike = await Like.findByIdAndUpdate(isLikedByUser?._id, {
                    $set: {
                        isReplyLiked: true,
                        isReplyDisLiked: false
                    }
                }, { new: true })

                if (!toggleCommentLike) {
                    throw new ApiErrors(500, "Internal Server Error while toggling Comment like")
                }
            }
        }

        if (!isLikedByUser) {
            likeComment = await Like.create({
                replyComment: replyCommentId,
                likedBy: req.user?._id,
                isReplyLiked: true
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


const toggleLikeAndDisLikeCommentReply = asyncHandler(async (req, res) => {

    const { replyCommentId } = req.params

    if (!replyCommentId) {
        throw new ApiErrors(400, "commentId is missing!")
    }

    try {
        const validId = await ReplyComment.findById(replyCommentId)

        if (!validId) {
            throw new ApiErrors(404, "comment not found!")
        }

        let dislikeComment, toggleCommentLike;

        const isLikedByUser = await Like.findOne({
            replyComment: replyCommentId,
            likedBy: req.user?._id,
        })

        if (isLikedByUser) {
            if (isLikedByUser?.isReplyLiked == true) {
                toggleCommentLike = await Like.findByIdAndUpdate(isLikedByUser?._id, {
                    $set: {
                        isReplyLiked: false,
                        isReplyDisLiked: true
                    }
                }, { new: true })

                if (!toggleCommentLike) {
                    throw new ApiErrors(500, "Internal Server Error while toggling Comment like")
                }
            }

            if (isLikedByUser?.isReplyDisLiked == false) {
                toggleCommentLike = await Like.findByIdAndUpdate(isLikedByUser?._id, {
                    $set: {
                        isReplyDisLiked: true
                    }
                }, { new: true })

                if (!toggleCommentLike) {
                    throw new ApiErrors(500, "Internal Server Error while toggling Comment like")
                }
            }
            if (isLikedByUser?.isReplyDisLiked == true) {
                toggleCommentLike = await Like.findByIdAndUpdate(isLikedByUser?._id, {
                    $set: {
                        isReplyDisLiked: false
                    }
                }, { new: true })

                if (!toggleCommentLike) {
                    throw new ApiErrors(500, "Internal Server Error while toggling Comment like")
                }
            }
        }

        if (!isLikedByUser) {
            dislikeComment = await Like.create({
                replyComment: replyCommentId,
                likedBy: req.user?._id,
                isReplyDisLiked: true
            })

            if (!dislikeComment) {
                throw new ApiErrors(500, "Internal Server Error while liking Comment")
            }
        }

        return res
            .status(200)
            .json(new ApiResponses(200, { toggleCommentLike, dislikeComment }, "Comment liked successfully"))
    } catch (error) {
        throw new ApiErrors(500, `Internal Server Error : ${error.message} `)
    }

})

const userReplyCommentLike = asyncHandler(async (req, res) => {

    const { replyCommentId } = req.params

    if (!replyCommentId) {
        throw new ApiErrors(400, "commentId is missing!")
    }

    let isLiked;

    const validId = await ReplyComment.findById(replyCommentId)

    if (!validId) {
        throw new ApiErrors(404, "comment not found!")
    }

    const isLikedByUser = await Like.findOne({
        replyComment: replyCommentId,
        likedBy: req.user?._id,
        isReplyLiked: true
    })

    if (isLikedByUser) {
        isLiked = true;
    }

    if (!isLikedByUser) {
        isLiked = false;
    }

    let dislike;

    const isDisLikedByUser = await Like.findOne({
        replyComment: replyCommentId,
        likedBy: req.user?._id,
        isReplyDisLiked: true
    })

    if (isDisLikedByUser) {
        dislike = true;
    }

    if (!isDisLikedByUser) {
        dislike = false;
    }

    return res
        .status(200)
        .json(new ApiResponses(200, { isLiked, dislike }, "Comment liked successfully"))

})


export {

    toggleUserVideoLike,
    toggleUserTweetLike,
    toggleUserCommentLike,
    getLikedVideos,
    userCommentLike,
    isVideoLiked,
    totalCommentLike,
    totalLikes,
    toggleLikeAndDisLike,
    toggleLikeAndDisLikeComment,
    totalReplyCommentLike,
    toggleReplyCommentLike,
    toggleLikeAndDisLikeCommentReply,
    userReplyCommentLike,
    removeFromLike


}