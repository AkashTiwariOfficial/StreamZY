import mongoose from "mongoose"


const viewDetails = new mongoose.Schema({
    videoId: {
    type: String
    },
    vistedUser: {
        type: String,
        default: ""
    },
    visitedTime: {
        type: Number,
        default: 0
    },
})




export const Views = mongoose.model("Views", viewDetails)