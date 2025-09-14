import { Playlist } from "../models/playlist.models.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponses } from "../utils/ApiResponses.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js"
import mongoose from "mongoose";



const createPlayList = asyncHandler(async (req, res) => {

    const { name, description } = req.body

    if (!(name && description)) {
        throw new ApiErrors(400, "Both name and description are required to create a PlayList")
    }

    const newPlayList = await Playlist.create({
        name,
        description,
        owner: req.user?._id
    })

    if (!newPlayList) {
        throw new ApiErrors(500, "Internal Server Error while creating playlist")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, newPlayList, "Playlist Created successfully"))

})


const getUserPlayLists = asyncHandler(async (req, res) => {

    const { userId } = req.params

    if (!userId) {
        throw new ApiErrors(400, "User Id is missing!")
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new ApiErrors(400, "User does not exists")
    }

    const userPlayLists = await Playlist.find({ owner: new mongoose.Types.ObjectId(userId) })

    if (userPlayLists.length === 0) {
        throw new ApiErrors(404, "No playlist found!")
    }

    if (!userPlayLists) {
        throw new ApiErrors(500, "Internal Server Error while fetching user's Playlist")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, userPlayLists, "User's playlists fetched successfully"))

})


const getPlayListById = asyncHandler(async (req, res) => {

    const { playListId } = req.params

    if (!playListId) {
        throw new ApiErrors(400, "PlayList id is missing!")
    }

    const getPlayList = await Playlist.findById(playListId)

    if (!getPlayList) {
        throw new ApiErrors(404, "PlayList does not exits")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, getPlayList, "PlayList fetched successfully"))

})


const deletePlaylist = asyncHandler(async (req, res) => {

    const { playListId } = req.params

    if (!playListId) {
        throw new ApiErrors(400, "PlayList id is missing!")
    }

    const getPlayList = await Playlist.findByIdAndDelete(playListId)

    if (!getPlayList) {
        throw ApiErrors(404, "PlayList does not exits or already deleted")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, {}, "PlayList deleted successfully"))

})


const updatePlayList = asyncHandler(async (req, res) => {

    const { playListId } = req.params

    if (!playListId) {
        throw new ApiErrors(400, "PlayList id is missing!")
    }

    const { name, description } = req.body

    if (!(name || description)) {
        throw new ApiErrors(400, "One field is requried to edit playList")
    }

    const updateDetails = {}

    if (name) { updateDetails.name = name }
    if (description) { updateDetails.description = description }

    const newPlayList = await Playlist.findByIdAndUpdate(playListId,
        {
            $set: updateDetails
        }, { new: true }
    )

    if (!newPlayList) {
        throw new ApiErrors(500, "Internal Server Error while updating Playlist")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, newPlayList, "Playlist Updated Successfully"))

})


const addVideosToPlayList = asyncHandler(async (req, res) => {

    const { playListId, videoId } = req.params

    if (!playListId) {
        throw new ApiErrors(400, "PlaylistId is missing!")
    }

    if (!videoId) {
        throw new ApiErrors(400, "videoId is missing!")
    }

    const getPlayList = await Playlist.findById(playListId)

    if (!getPlayList) {
        throw new ApiErrors(404, "Playlist does not exists")
    }

    const findVideo = await Video.findById(videoId)

    if (!findVideo) {
        throw new ApiErrors(404, "Video not found!")
    }

    if (getPlayList.videos.includes(videoId)) {
        throw new ApiErrors(400, "Video already exists in PlayList")
    }

    const addVideo = await Playlist.findByIdAndUpdate(playListId,
        {
            $addToSet: {
                videos: videoId
            }
        }, { new: true }
    )

    if (!addVideo) {
        throw new ApiErrors(500, "Internal Server Error while adding video to Playlist")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, addVideo, "Video added to Playlist successfully"))

})


const addManyVideosToPlalyList = asyncHandler(async (req, res) => {

    const { playListId } = req.params

    if (!playListId) {
        throw new ApiErrors(400, "PlaylistId is missing!")
    }

    const { videoIds } = req.body

    if ((!videoIds && videoIds.length === 0) || (videoIds && videoIds.length === 0) ) {
        throw new ApiErrors(400, "videoIds are missing!")
    }

    const getPlayList = await Playlist.findById(playListId)

    if (!getPlayList) {
        throw new ApiErrors(404, "Playlist does not exists")
    }

    let addManyVideo;

    const result = await Video.find({
        _id: { $in: videoIds }
    })

    if (result.length !== videoIds.length) {
        throw new ApiErrors(404, "One or more videos do not exists")
    }

    const existingVidoes = getPlayList.videos.filter((videoId) => { return videoIds.includes(videoId.toString()) })

    const newVidoes = videoIds.filter(videoId => !getPlayList.videos.includes(videoId.toString()))

    if (newVidoes.length !== 0) {
        addManyVideo = await Playlist.findByIdAndUpdate(playListId,
            {
                $addToSet: {
                    videos: {
                        $each: newVidoes
                    }
                }
            }, { new: true }
        )

        if (!addManyVideo) {
            throw new ApiErrors(500, "Internal Server Error while adding videos to Playlist")
        }
    }

    if (existingVidoes.length !== 0) {
        throw new ApiErrors(400, `These Videos are already in playlist ${existingVidoes} and Remaining Videos are added to Playlist successfully ${addManyVideo}`)
    }

    return res
        .status(200)
        .json(new ApiResponses(200, addManyVideo, "Videos were added to Playlist successfully"))

})


const deleteVideoFromPlayList = asyncHandler(async (req, res) => {

    const { playListId, videoId } = req.params

    if (!playListId) {
        throw new ApiErrors(400, "PlaylistId is missing!")
    }

    if (!videoId) {
        throw new ApiErrors(400, "videoId is missing!")
    }

    const getPlayList = await Playlist.findById(playListId)

    if (!getPlayList) {
        throw new ApiErrors(404, "Playlist does not exists")
    }

    const findVideo = await Video.findById(videoId)

    if (!findVideo) {
        throw new ApiErrors(404, "Video not found!")
    }

    if (!getPlayList.videos.includes(videoId)) {
        throw new ApiErrors(404, "Video is already deleted from PlayList or has not been added to Playlist")
    }

    const deleteVideo = await Playlist.findByIdAndUpdate(playListId,
        {
            $pull: {
                videos: videoId
            }
        }, { new: true }
    )

    if (!deleteVideo) {
        throw new ApiErrors(500, "Internal Server Error while adding video to Playlist")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, {}, "Video deleted from Playlist successfully"))

})


const deleteManyVideos = asyncHandler(async (req, res) => {

    const { playListId } = req.params

    if (!playListId) {
        throw new ApiErrors(400, "PlaylistId is missing!")
    }

    const { videoIds } = req.body

    if ((!videoIds && videoIds.length === 0) || (videoIds && videoIds.length === 0) ) {
        throw new ApiErrors(400, "videoIds are missing!")
    }

    const getPlayList = await Playlist.findById(playListId)

    if (!getPlayList) {
        throw new ApiErrors(404, "Playlist does not exists")
    }

    let addManyVideo;

    const result = await Video.find({
        _id: { $in: videoIds }
    })

    if (result.length !== videoIds.length) {
        throw new ApiErrors(404, "One or more videos do not exists")
    }

    const existingVidoes = getPlayList.videos.filter((videoId) => { return videoIds.includes(videoId.toString()) })

    const videoDoesNotExists = videoIds.filter(videoId => !getPlayList.videos.includes(videoId.toString()))

    if (existingVidoes.length !== 0) {

        addManyVideo = await Playlist.findByIdAndUpdate(playListId,
            {
                $pullAll: {
                    videos: existingVidoes
                }
            }, { new: true }
        )

        if (!addManyVideo) {
            throw new ApiErrors(500, "Internal Server Error while adding videos to Playlist")
        }
    }

    if (videoDoesNotExists.length !== 0) {
        throw new ApiErrors(400, `These Videos does exists in playlist ${videoDoesNotExists} and Remaining Videos are deleted from Playlist successfully ${addManyVideo}`)
    }

    return res
        .status(200)
        .json(new ApiResponses(200, addManyVideo, "Videos were deleted from Playlist successfully"))

})

export {

    createPlayList,
    getUserPlayLists,
    getPlayListById,
    deletePlaylist,
    updatePlayList,
    addVideosToPlayList,
    addManyVideosToPlalyList,
    deleteVideoFromPlayList,
    deleteManyVideos

}