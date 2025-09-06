import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponses } from "../utils/ApiResponses.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary, uploadVideoOnCloudinary } from "../utils/cloudinary.js";








const getAllVideos = asyncHandler(async (req, res) => {

    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
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

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiErrors(404, "Video does not exists");
    }

    return res
        .status(200)
        .json(new ApiResponses(200, video, "Video fetched successfully"))

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

    if(!videoFile){
        throw new ApiErrors(404, "VideoFile not found!")
    }

    const old_public_id = video?.videoFile_public_id

    const updateVideoFile = await Video.findByIdAndUpdate(videoId,{
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


const togglePublishVideo = asyncHandler( async (req, res) =>{
    
    const { videoId } = req.params

      if (!videoId) {
        throw new ApiErrors(400, "video id is missing!")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiErrors(404, "Video does not exists");
    }

    let isPublished ;

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
    .json( new ApiResponses(200, togglePublish.isPublished, "Video Published Mode toggled successfully"))
})

export {
    publishAVideo,
    uploadManyVideos,
    getVideoById,
    deleteVideoById,
    updateVideoDetails,
    updateVideo,
    togglePublishVideo
}