import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponses } from "../utils/ApiResponses.js";
import { Comment } from "../models/comment.models.js";
import { User } from "../models/user.models.js"
import { ReplyComment } from "../models/replyComment.models.js";
 

const getCommentReply = asyncHandler(async (req, res) => {

    const { commentId } = req.params

    const { page = 1, limit = 10, sortBy = "createdAt", sortType = "desc" } = req.query

    const limitNumber = parseInt(limit, 10)
    const pageNumber = parseInt(page, 10)

     const sort = {}

    if (sortBy) {
        sort[sortBy] = sortType === "desc" ? -1 : 1;
    }

    if (!commentId) {
        throw new ApiErrors(400, "commentId is missing!")
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiErrors(404, "Video not found! or Invalid videoId");
    }

    const fetchAllCommentReply = await ReplyComment.find({ comment: commentId })
    .sort(sort)
    .skip((pageNumber - 1) * 10)
    .limit(limitNumber)
    .populate(
        "owner",  "username avatar"
    )


    if (!fetchAllCommentReply) {
        throw new ApiErrors(500, "Internal Server Error while fetching comments")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, fetchAllCommentReply, "Comment added on Video Successfully"))

})


const addCommentReply = asyncHandler(async (req, res) => {

    const { commentId } = req.params

    if (!commentId) {
        throw new ApiErrors(400, "videoId is missing!")
    }

    const isComment = await Comment.findById(commentId);

    if (!isComment) {
        throw new ApiErrors(404, "Comment not found! or Invalid CommentId");
    }

    const { comment } = req.body

    if (!comment) {
        throw new ApiErrors(400, "Comment field is required!")
    }

    const addCommentOnVideo = await ReplyComment.create({
        content: comment,
        owner: req.user?._id,
        comment: commentId
    })

    if (addCommentOnVideo) {
        await Comment.findByIdAndUpdate(commentId, {
            $inc: {
                replies: 1
            }
        })
    }

     await addCommentOnVideo.populate("owner", "username avatar");

    if (!addCommentOnVideo) {
        throw new ApiErrors(500, "Internal Server Error while adding comment's reply")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, addCommentOnVideo, "Replied Comment added on Comment Successfully"))

})


const updateComment = asyncHandler(async (req, res) => {

    const { replyCommentId } = req.params

    if (!replyCommentId) {
        throw new ApiErrors(400, "commentId is missing!")
    }

    const validCommentId = await ReplyComment.findById(replyCommentId)

    if (!validCommentId) {
        throw new ApiErrors(404, "Invalid commentId! or comment do not exists")
    }

    const { comment } = req.body

    if (!comment) {
        throw new ApiErrors(400, "Comment field is required!")
    }

    const changedComment = await ReplyComment.findByIdAndUpdate(replyCommentId, {
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

    const { replyCommentId } = req.params

    if (!replyCommentId) {
        throw new ApiErrors(400, "commentId is missing!")
    }

    const validCommentId = await ReplyComment.findById(replyCommentId)

    if (!validCommentId) {
        throw new ApiErrors(404, "Invalid commentId! or comment do not exists")
    }

    const delComment = await ReplyComment.findByIdAndDelete(replyCommentId)

          if (delComment) {
                await Comment.findByIdAndUpdate(validCommentId?.comment, {
            $inc: {
                replies: -1
            }
        })
          }

    if (!delComment) {
        throw new ApiErrors(500, "Internal Server Error while deleting comment on the video")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, {}, "Comment deleted Successfully"))

})






export {

    getCommentReply,
    addCommentReply,
    updateComment,
    deleteComment

}