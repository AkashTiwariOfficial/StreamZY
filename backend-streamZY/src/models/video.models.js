import mongoose from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"


const videoSchema = new mongoose.Schema(
    {
        videoFile: {
            type: String, // cloudinary url
            required: true
        },
        videoFile_public_id: {
            type: String
        },
        thumbnail: {
            type: String,  // cloudinary url
            default: ""
        },
        thumbnail_public_id: {
            type: String
        },
        title: {
            type: String,
            default: ""
        },
        description: {
            type: String,
            default: ""
        },
        tag:{
            type: String,
            default: ""
        },
        duration: {
            type: Number,
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
           type: Boolean,
           default: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        ownerName:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
         ownerAvatar:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)


videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema)