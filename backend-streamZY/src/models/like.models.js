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
    replyComment: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "ReplyComment"
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
    }, 
     isVideoDisLiked: {
        type: Boolean,
        default: false
     },
     isCommentDisLiked: {
        type: Boolean,
        default: false
     }, 
      isReplyLiked: {
            type: Boolean,
            default:false
      },
        isReplyDisLiked: {
            type: Boolean,
            default:false
      },

}, { timestamps: true })

export const Like = mongoose.model("Like", likeSchema)