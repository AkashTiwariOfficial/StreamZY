import { Playlist } from "../models/playlist.models.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponses } from "../utils/ApiResponses.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js"
import mongoose from "mongoose";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";



const createPlayList = asyncHandler(async (req, res) => {

    const { name, description, title, isPublic } = req.body

    if (!(name && description && title)) {
        throw new ApiErrors(400, "Both name and description are required to create a PlayList")
    }

    const thumbnailFilePath = req.file?.path

    if (!thumbnailFilePath) {
        throw new ApiErrors(400, "Thumbnail is required");
    }

    let thumbnail;

    try {
        thumbnail = await uploadOnCloudinary(thumbnailFilePath);

        if (!thumbnail) {
            throw new ApiErrors(400, "thumbnail not found!")
        }

        const newPlayList = await Playlist.create({
            name,
            description,
            title,
            owner: req.user?._id,
            thumbnail: thumbnail.url,
            public_id_thumbnail: thumbnail.public_id,
            public: isPublic
        })

        if (!newPlayList) {
            throw new ApiErrors(500, "Internal Server Error while creating playlist")
        }

        return res
            .status(200)
            .json(new ApiResponses(200, newPlayList, "Playlist Created successfully"))

    } catch (error) {
        if (thumbnail?.public_id) {
            await deleteFromCloudinary(thumbnail.public_id, "image")
        }
        throw new ApiErrors(500, `Internal Server Error while uploading the video: ${error.message} `)
    }

})


const getUserPlayLists = asyncHandler(async (req, res) => {

    const { userId } = req.params

    if (!userId) {
        throw new ApiErrors(400, "User Id is missing!")
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiErrors(400, "User does not exists")
    }

    const userPlayLists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(user._id)
            }
        },
        /*           {
                    $unwind: "$watchHistory"
                  }, */
        {
            $lookup: {
                from: "videos",
                foreignField: "_id",
                localField: "videos",
                as: "videos",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
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
            }
        },
        /*    {
               $addFields: {
                   "watchHistory.video": {
                       $first: "$watchHistory.video"
                   }
               }
             } */
    ])

    /*     const userPlayLists = await Playlist.find({ owner: new mongoose.Types.ObjectId(userId) }).populate("owner", "avatar username") */

    if (!userPlayLists) {
        throw new ApiErrors(500, "Internal Server Error while fetching user's Playlist")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, userPlayLists, "User's playlists fetched successfully"))

})


const getPlayLists = asyncHandler(async (req, res) => {

    const PlayLists = await Playlist.aggregate([
        {
            $match: {
                public: true
            }
        },
        {
            $lookup: {
                from: "videos",
                foreignField: "_id",
                localField: "videos",
                as: "videos",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
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
            }
        },
    ])

    /*     const userPlayLists = await Playlist.find({ owner: new mongoose.Types.ObjectId(userId) }).populate("owner", "avatar username") */

    if (!PlayLists) {
        throw new ApiErrors(500, "Internal Server Error while fetching user's Playlist")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, PlayLists, "User's playlists fetched successfully"))

})

const getPlayListById = asyncHandler(async (req, res) => {

    const { playListId } = req.params

    if (!playListId) {
        throw new ApiErrors(400, "PlayList id is missing!")
    }

    /*    const getPlayList = await Playlist.findById(playListId) */

    const getPlayList = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playListId)
            }
        },
        {
            $lookup: {
                from: "videos",
                foreignField: "_id",
                localField: "videos",
                as: "videos",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
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
            }
        },

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
                            fullName: 1
                        }
                    }
                ]
            },
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        }

    ])

    return res
        .status(200)
        .json(new ApiResponses(200, getPlayList[0], "PlayList fetched successfully"))

})


const deletePlaylist = asyncHandler(async (req, res) => {

    const { playListId } = req.params

    if (!playListId) {
        throw new ApiErrors(400, "PlayList id is missing!")
    }
    await User.updateMany({}, {
    $pull: {
            savedPlaylists: {
                playlist: playListId
            }
        }
    })
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

    const playList = await Playlist.findById(playListId);

    const { name, description, title, isPublic } = req.body

    const thumbnailFilePath = req.file?.path

    if (!(name || description || title || thumbnailFilePath || "isPublic" in req.body)) {
        throw new ApiErrors(400, "One field is requried to edit playList")
    }

    let thumbnail;
    if (thumbnailFilePath) {
        thumbnail = await uploadOnCloudinary(thumbnailFilePath);
    }

    const updateDetails = {}

    if (name) { updateDetails.name = name }
    if (description) { updateDetails.description = description }
    if (title) { updateDetails.title = title }
    if (thumbnail) {
        updateDetails.thumbnail = thumbnail.url,
            updateDetails.public_id_thumbnail = thumbnail.public_id
    }
    if ("isPublic" in req.body) {
        updateDetails.public = req.body.isPublic;
    }

    const newPlayList = await Playlist.findByIdAndUpdate(playListId,
        {
            $set: updateDetails
        }, { new: true }
    )

    if (newPlayList && thumbnail) {
        await deleteFromCloudinary(playList.public_id_thumbnail, "thumbnail")
    }

    if (!newPlayList && thumbnail) {
        await deleteFromCloudinary(thumbnail.public_id, "thumbnail")
        throw new ApiErrors(400, `${file.filename} could not be uploaded`)
    }

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

    if ((!videoIds && videoIds.length === 0) || (videoIds && videoIds.length === 0)) {
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

    if ((!videoIds && videoIds.length === 0) || (videoIds && videoIds.length === 0)) {
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

const deleteAllPlaylist = asyncHandler(async (req, res) => {

    const deleteAll = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            savedPlaylists: []
        },
    }, { new: true }).select(
        "-password -refreshToken"
    );

    return res
        .status(200)
        .json(new ApiResponses(200, deleteAll, "playlists deleted successfully"));

})

const savedPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!playlistId) {
        throw new ApiErrors(400, "playlist id is missing!")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiErrors(404, "Playlist does not exists");
    }

    const exists = await User.exists({
        _id: req.user?._id,
        "savedPlaylists.playlist": playlistId
    });

    let newAdd;

    if (!exists) {
        await User.findByIdAndUpdate(req.user?._id, {
            $push: {
                savedPlaylists: {
                    playlist: playlistId,
                    savedPlaylistAt: new Date()
                }
            },
        }, { new: true });
        newAdd = true
    }

    if (exists) {
        await User.findByIdAndUpdate(req.user?._id, {
            $pull: {
                savedPlaylists: {
                    playlist: playlistId,
                }
            },
        }, { new: true });
        newAdd = false;
    }


    return res
        .status(200)
        .json(new ApiResponses(200, newAdd, "playlist saved successfully"));

})

const isPlaylistSaved = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!playlistId) {
        throw new ApiErrors(400, "playlist id is missing!")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiErrors(404, "playlist does not exists");
    }

    const exists = await User.exists({
        _id: req.user?._id,
        "savedPlaylists.playlist": playlistId
    });

    let newAdd;

    if (exists) {
        newAdd = true;
    }
    if (!exists) {
        newAdd = false;
    }

    return res
        .status(200)
        .json(new ApiResponses(200, newAdd, "playlist fetched  successfully"));

})


const removesavedPlaylist = asyncHandler(async (req, res) => {
    const { playListId } = req.params

    if (!playListId) {
        throw new ApiErrors(400, "playList id is missing!")
    }

    const playList = await Playlist.findById(playListId)

    if (!playList) {
        throw new ApiErrors(404, "playList does not exists");
    }

    const exists = await User.exists({
        _id: req.user?._id,
        "savedPlaylists.playlist": playListId
    });

    let updateAdd;

    if (exists) {
        updateAdd = await User.findByIdAndUpdate(req.user?._id, {
            $pull: {
                savedPlaylists: {
                    playlist: {
                        $in: playListId
                    },
                }
            },
        }, { new: true }).select(
            "-password -refreshToken"
        );
    }

    return res
        .status(200)
        .json(new ApiResponses(200, updateAdd, "playlist deleted from saved successfully"));

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
    deleteManyVideos,
    getPlayLists,
    isPlaylistSaved,
    savedPlaylist,
    deleteAllPlaylist,
    removesavedPlaylist

}