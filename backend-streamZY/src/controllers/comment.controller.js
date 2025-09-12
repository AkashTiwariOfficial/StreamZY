import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponses } from "../utils/ApiResponses.js";
import { Video } from "../models/video.models.js";
import { Comment } from "../models/comment.models.js";



const getVideoComment = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    const { page = 1, limit = 10, sortBy = "createdAt", sortType = "desc" } = req.query

    const limitNumber = parseInt(limit, 10)
    const pageNumber = parseInt(page, 10)

     const sort = {}

    if (sortBy) {
        sort[sortBy] = sortType === "desc" ? -1 : 1;
    }

    if (!videoId) {
        throw new ApiErrors(400, "videoId is missing!")
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiErrors(404, "Video not found! or Invalid videoId");
    }

    const fetchAllComment = await Comment.find({ video: videoId })
    .sort(sort)
    .skip((pageNumber - 1) * 10)
    .limit(limitNumber)

    if (fetchAllComment.length === 0) {
        throw new ApiErrors(404, "No comments found on this video")
    }

    if (!fetchAllComment) {
        throw new ApiErrors(500, "Internal Server Error while fetching comments")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, fetchAllComment, "Comment added on Video Successfully"))

})


const addComment = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    if (!videoId) {
        throw new ApiErrors(400, "videoId is missing!")
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiErrors(404, "Video not found! or Invalid videoId");
    }

    const { comment } = req.body

    if (!comment) {
        throw new ApiErrors(400, "Comment field is required!")
    }

    const addCommentOnVideo = Comment.create({
        content: comment,
        owner: req.user?._id,
        video: videoId
    })

    if (!addCommentOnVideo) {
        throw new ApiErrors(500, "Internal Server Error while adding comment on the video")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, addCommentOnVideo, "Comment added on Video Successfully"))

})


const updateComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params

    if (!commentId) {
        throw new ApiErrors(400, "commentId is missing!")
    }

    const validCommentId = await Comment.findById(commentId)

    if (!validCommentId) {
        throw new ApiErrors(404, "Invalid commentId! or comment do not exists")
    }

    const { comment } = req.body

    if (!comment) {
        throw new ApiErrors(400, "Comment field is required!")
    }

    const changedComment = await Comment.findByIdAndUpdate(commentId, {
        $set: {
            content: comment
        }
    }, { new: true })

    if (!changedComment) {
        throw new ApiErrors(500, "Internal Server Error while updating comment on the video")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, changedComment, "Comment Updated Successfully"))

})


const deleteComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params

    if (!commentId) {
        throw new ApiErrors(400, "commentId is missing!")
    }

    const validCommentId = await Comment.findById(commentId)

    if (!validCommentId) {
        throw new ApiErrors(404, "Invalid commentId! or comment do not exists")
    }

    const delComment = await Comment.findByIdAndDelete(commentId)

    if (!delComment) {
        throw new ApiErrors(500, "Internal Server Error while deleting comment on the video")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, {}, "Comment deleted Successfully"))

})






export {

    getVideoComment,
    addComment,
    updateComment,
    deleteComment

}