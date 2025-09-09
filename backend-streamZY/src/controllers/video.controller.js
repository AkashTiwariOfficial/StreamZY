import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { Views } from "../models/videoViewsData.models.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponses } from "../utils/ApiResponses.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary, uploadVideoOnCloudinary } from "../utils/cloudinary.js";



const getAllVideos = asyncHandler(async (req, res) => {

    const { page = 1, limit = 10, query, sortBy = "views", sortType = "desc", userId } = req.query

    const limitNumber = parseInt(limit, 10)
    const pageNumber = parseInt(page, 10)

    const filter = {}

    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { tag: { $regex: query, $options: "i" } }
        ]
    }

    const sort = {}

    if (sortBy) {
        sort[sortBy] = sortType === "desc" ? -1 : 1;
    }

    if (userId) {
        filter.userId = userId
    }
    
    const vidoes = await Video.find(filter)
    .sort(sort)
    .skip((pageNumber - 1) * 10)
    .limit(limitNumber)
  
    if(!vidoes){
        throw new ApiErrors(500, "No Vidoes found!")
    }

    return res
    .status(200)
    .json( new ApiResponses(200, vidoes , "All Videos were fetched successfully"))
})


const publishAVideo = asyncHandler(async (req, res) => {

    const { title, description, tag } = req.body

    if (!(title && description && tag)) {
        throw new ApiErrors(400, "title, description and tag all are required!")
    }

    const thumbnailFilePath = req.files?.thumbnail[0]?.path

    if (!thumbnailFilePath) {
        throw new ApiErrors(400, "Thumbnail is required");
    }

    const videoFilePath = req.files?.videoFile[0]?.path

    if (!videoFilePath) {
        throw new ApiErrors(400, "Vedio file is required")
    }

    let thumbnail, videoFile

    try {
        thumbnail = await uploadOnCloudinary(thumbnailFilePath);
        videoFile = await uploadVideoOnCloudinary(videoFilePath);

        if (!videoFile) {
            throw new ApiErrors(400, "VideoFile not found!")
        }

        if (!thumbnail) {
            throw new ApiErrors(400, "thumbnail not found!")
        }

        const uploadedVideoFile = await Video.create({
            videoFile: videoFile.url,
            thumbnail: thumbnail.url,
            videoFile_public_id: videoFile.public_id,
            thumbnail_public_id: thumbnail.public_id,
            title: title,
            description: description,
            tag: tag,
            duration: videoFile.duration,
            owner: req.user?._id,
            isPublished: true
        })

        return res
            .status(200)
            .json(new ApiResponses(200, { uploadedVideoFile }, "Video successfully uploaded"))

    } catch (error) {
        if (thumbnail?.public_id) {
            await deleteFromCloudinary(thumbnail.public_id, "image")
        }
        if (videoFile?.public_id) {
            await deleteFromCloudinary(videoFile.public_id, "video")
        }

        throw new ApiErrors(500, `Internal Server Error while uploading the video: ${error.message} `)
    }

})


/* const uploadManyVideoss = asyncHandler(async (req, res) => {

    const arr = []

    const isThereVideo = req.files[0]?.path

    if (!isThereVideo) {
        throw new ApiErrors(400, "videoFile is requried")
    }

        for (let i = 0; i < req.files?.length; i++) {

            const videoFilePath = req.files[i]?.path

            if (!videoFilePath) {
                throw new ApiErrors(400, "videoFile is requried")
            }

            const videoFile = await uploadVideoOnCloudinary(videoFilePath)

            if (!videoFile) {
                throw new ApiErrors(400, "videoFile not found!")
            }

            const uploadVideos = await Video.create({
                videoFile: videoFile.url,
                videoFile_public_id: videoFile.public_id,
                duration: videoFile.duration,
                owner: req.user?._id,
                isPublished: false
            })

            if (!uploadVideos) {
                await deleteFromCloudinary(videoFile.public_id, "video")
                throw new ApiErrors(400, `${req.files[i]?.filename} could not be uploaded`)
            }

            arr.push(uploadVideos)

        }

        return res
            .status(200)
            .json(new ApiResponses(200, arr , "Videos uploaded successfully successfully"))

}) */

const uploadManyVideos = asyncHandler(async (req, res) => {

    const isThereVideo = req.files[0]?.path

    if (!isThereVideo) {
        throw new ApiErrors(400, "videoFile is requried")
    }

    const results = await Promise.all(req.files?.map(async (file) => {

        const videoFilePath = file?.path

        if (!videoFilePath) {
            throw new ApiErrors(400, "videoFile is requried")
        }

        const videoFile = await uploadVideoOnCloudinary(videoFilePath)

        if (!videoFile) {
            throw new ApiErrors(400, "videoFile not found!")
        }

        const uploadVideos = await Video.create({
            videoFile: videoFile.url,
            videoFile_public_id: videoFile.public_id,
            duration: videoFile.duration,
            owner: req.user?._id,
            isPublished: false
        })

        if (!uploadVideos) {
            await deleteFromCloudinary(videoFile.public_id, "video")
            throw new ApiErrors(400, `${file.filename} could not be uploaded`)
        }

        return uploadVideos
    }))

    return res
        .status(200)
        .json(new ApiResponses(200, results, "Videos uploaded successfully successfully"))

})


const getVideoById = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    if (!videoId) {
        throw new ApiErrors(400, "video id is missing!")
    }

    let viewDetails;
    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiErrors(404, "Video does not exists");
    }

    const checkView = await Views.findOne({
        videoId: videoId,
        vistedUser: req.user?._id
    })

    if (!checkView) {
        viewDetails = await Views.create({
            videoId: videoId,
            vistedUser: req.user?._id,
            visitedTime: Date.now()
        })
    }

    /*  if (checkView) {
         if (checkView.vistedUser.toString() !== req.user?._id.toString()) {
             viewDetails = await Views.create({
                 videoId: videoId,
                 vistedUser: req.user?._id,
                 visitedTime: Date.now()
             })
         } */

    return res
        .status(200)
        .json(new ApiResponses(200, { video, viewDetails }, "Video fetched successfully"))

})


const deleteVideoById = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    if (!videoId) {
        throw new ApiErrors(400, "video id is missing!")
    }

    const video = await Video.findByIdAndDelete(videoId)

    if (!video) {
        throw new ApiErrors(404, "Video does not exists");
    }

    return res
        .status(200)
        .json(new ApiResponses(200, {}, "Video deleted successfully"))

})


const updateVideoDetails = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    let thumbnail;

    if (!videoId) {
        throw new ApiErrors(400, "video id is missing!")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiErrors(404, "Video does not exists");
    }

    const { title, description, tag } = req.body

    const thumbnailFilePath = req.file?.path

    if (!(title || description || tag || thumbnailFilePath)) {
        throw new ApiErrors(400, "Atleast one field is required! to update")
    }

    if (thumbnailFilePath) {
        thumbnail = await uploadOnCloudinary(thumbnailFilePath)
    }

    const old_public_id = video?.thumbnail_public_id;

    const updateFields = {}

    if (title) { updateFields.title = title }
    if (description) { updateFields.description = description }
    if (tag) { updateFields.tag = tag }
    if (thumbnail) {
        updateFields.thumbnail = thumbnail?.url
        updateFields.thumbnail_public_id = thumbnail?.public_id
    }

    console.log(updateFields)
    const updatedDetials = await Video.findByIdAndUpdate(videoId, {
        $set: updateFields
    },
        { new: true })

    if (!updatedDetials) {
        await deleteFromCloudinary(thumbnail?.public_id, "image")
        throw new ApiErrors(404, "Video could not be updated. Try again!");
    }

    try {
        if (old_public_id) {
            await deleteFromCloudinary(old_public_id, "image")
        }
    } catch (error) {
        throw new ApiErrors(500, `Internal Server Error while deleting old image : ${error.message}`);
    }

    return res
        .status(200)
        .json(new ApiResponses(200, updatedDetials, "Video details updated successfully"))

})


const updateVideo = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    if (!videoId) {
        throw new ApiErrors(400, "video id is missing!")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiErrors(404, "Video does not exists");
    }

    const videoFilePath = req.file?.path

    if (!videoFilePath) {
        throw new ApiErrors(404, "Video file path not found!")
    }

    const videoFile = await uploadVideoOnCloudinary(videoFilePath)

    if (!videoFile) {
        throw new ApiErrors(404, "VideoFile not found!")
    }

    const old_public_id = video?.videoFile_public_id

    const updateVideoFile = await Video.findByIdAndUpdate(videoId, {
        $set: {
            videoFile: videoFile?.url,
            videoFile_public_id: videoFile?.public_id
        }
    }, { new: true }
    )

    if (!updateVideoFile) {
        await deleteFromCloudinary(videoFile?.public_id, "video")
        throw new ApiErrors(400, "VideoFile uploaded failed! rollback initiated , try again")
    }

    try {
        if (old_public_id) {
            await deleteFromCloudinary(old_public_id, "video")
        }
    } catch (error) {
        throw new ApiErrors(500, `Internal Server Error while deleting old video : ${error.message}`);
    }

    return res
        .status(200)
        .json(new ApiResponses(200, updateVideoFile, "Video File updated successfully"))

})


const togglePublishVideo = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    if (!videoId) {
        throw new ApiErrors(400, "video id is missing!")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiErrors(404, "Video does not exists");
    }

    let isPublished;

    if (video?.isPublished) {
        isPublished = false
    } else {
        isPublished = true
    }

    const togglePublish = await Video.findByIdAndUpdate(videoId,
        {
            $set: {
                isPublished: isPublished
            }
        }, { new: true }
    )

    if (!togglePublish) {
        throw new ApiErrors(400, "Toggle publishVideo failed! try again")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, togglePublish.isPublished, "Video Published Mode toggled successfully"))

})


const increaseViewCount = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    if (!videoId) {
        throw new ApiErrors(400, "video id is missing!")
    }

    try {
        let updateViewsDetails, updateViews;

        const video = await Video.findById(videoId)

        if (!video) {
            throw new ApiErrors(404, "Video does not exists");
        }

        const durationInSec = parseFloat(video.duration)
        const minGapToIncreaseView = (0.07 * durationInSec)

        const countViews = await Views.findOne({
            videoId: video._id,
            vistedUser: req.user?._id
        })

        const newTimeToIncreseViews = countViews.visitedTime + (minGapToIncreaseView * 1000);
        const newDate = Date.now()

        if (newDate > newTimeToIncreseViews) {

            const views = video.views + 1;

            updateViews = await Video.findByIdAndUpdate(videoId,
                {
                    $set: {
                        views: views,
                    }
                }, { new: true }
            )

            if (!updateViews) {
                throw new ApiErrors(400, "Upadte Count views failed");
            }

            updateViewsDetails = await Views.findByIdAndUpdate(countViews._id, {
                $set: {
                    visitedTime: newDate
                }
            }, { new: true }
            )

            if (!updateViewsDetails) {
                throw new ApiErrors(400, "Upadte Count views Model Details failed");
            }
        } else {
            throw new ApiErrors(400, "Cannot increase Views as User rectenly watched Video")
        }

        return res
            .status(200)
            .json(new ApiResponses(200, { updateViewsDetails, updateViews }, "View count increased Successfully"))
    } catch (error) {
        throw new ApiErrors(500, `Internal Server Error While Incresing The count of Views : ${error.message}`);
    }

})





export {
    getAllVideos,
    publishAVideo,
    uploadManyVideos,
    getVideoById,
    deleteVideoById,
    updateVideoDetails,
    updateVideo,
    togglePublishVideo,
    increaseViewCount
}