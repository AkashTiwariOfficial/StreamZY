import { Playlist } from "../models/playlist.models.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponses } from "../utils/ApiResponses.js";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";



const createPlayList = asyncHandler( async ( req, res ) => {

    const { name, description } = req.body

    if (!(name && description)) {
        throw new ApiErrors(400, "Both name and description are required to create a PlayList")
    }

    const newPlayList = await Playlist.create({
        name,
        description,
        owner: req.user?._id
    })

    if (!playList) {
         throw new ApiErrors(500, "Internal Server Error while creating playlist")
    }

    return res
    .status(200)
    .json( new ApiResponses(200, newPlayList, "Playlist Created successfully"))
          
})


const getUserPlayLists = asyncHandler( async ( req, res ) => {

    const { userId } = req.params
 
    if (userId) {
        throw new ApiErrors(400, "User Id is missing!")
    }

    const user = await User.findById(userId)

    if (!user) {
        throw  new ApiErrors(400, "User does not exists")
    }

    const userPlayLists = await Playlist.find({owner: new mongoose.Types.ObjectId(userId)})
   
    if (!userPlayLists) {
        throw new ApiErrors(404, "No playlist found!")
    }

    return res
    .status(200)
    .json( new ApiResponses(200, userPlayLists, "User's playlists fetched successfully"))

})


const getPlayListById = asyncHandler( async ( req, res ) => {

    const { playListId } = req.body

    if (!playListId) {
        throw new ApiErrors(400, "PlayList id is missing!")
    }

    const getPlayList = await Playlist.findById(playListId)

    if (!getPlayList) {
        throw ApiErrors(400, "PlayList does not exits")
    }

    return res
    .status(200)
    .json( new ApiResponses(200, getPlayList, "PlayList fetched successfully"))
})












export {

}