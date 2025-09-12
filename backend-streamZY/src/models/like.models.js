import mongoose from "mongoose";


const likeSchema = new mongoose.Schema({
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    },
    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    tweet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet"
    },
    isCommentLiked: {
        type: Boolean,
        default: false
    },
     isVideoLiked: {
        type: Boolean,
        default: false
    },
     isTweetLiked: {
        type: Boolean,
        default: false
    }



}, { timestamps: true })

export const Like = mongoose.model("Like", likeSchema)