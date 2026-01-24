import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteAllSavedVideos, deleteAllWatchedVideo, deleteVideoById, deleteWatchedVideo, getAllVideos, getVideoById, increaseViewCount, publishAVideo, savedVideo, togglePublishVideo, updateVideo, updateVideoDetails, uploadManyVideos, watchedVideo } from "../controllers/video.controller.js";




const router = Router();


router.route("/get-allVideos").get(
    verifyJWT,
    getAllVideos
)

router.route("/publishVideo").post(
    verifyJWT,
    upload.fields([
        {
        name: "thumbnail",
        maxCount: 1
    },
    {
        name: "videoFile",
        maxCount: 1
    }
    ]),
    publishAVideo
)

 router.route("/uploadVideos").post(
    verifyJWT,
    upload.array("videoFile", 5),
    uploadManyVideos
 )

router.route("/get-video/:videoId").get(
    verifyJWT,
    getVideoById
)

router.route("/delete/:videoId").delete(
    verifyJWT,
    deleteVideoById
)

router.route("/update-videoDetails/:videoId").patch(
    verifyJWT,
    upload.single("thumbnail"),
    updateVideoDetails
)

router.route("/update-video/:videoId").patch(
    verifyJWT,
    upload.single("videoFile"),
    updateVideo
)

router.route("/toggle-publish/:videoId").patch(
    verifyJWT,
    togglePublishVideo
)

router.route("/views/:videoId").patch(
    verifyJWT,
    increaseViewCount
)

router.route("/update-watch-history/:videoId").patch(
    verifyJWT,
    watchedVideo
)


router.route("/saved-video/:videoId").patch(
    verifyJWT,
    savedVideo
)

router.route("/delete-saved-videos").patch(
    verifyJWT,
    deleteAllSavedVideos
)

router.route("/delete-watched-Video/:videoId").patch(
    verifyJWT,
    deleteWatchedVideo
)

router.route("/delete-watch-History-videos").patch(
    verifyJWT,
    deleteAllWatchedVideo
)






export default router