import mongoose from "mongoose";



const playListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    thumbnail: {
        type: String,  // cloudinary url
        default: ""
    },
    public_id_thumbnail: {
        type: String
    },
}, { timestamps: true })




export const Playlist = mongoose.model("Playlist", playListSchema)