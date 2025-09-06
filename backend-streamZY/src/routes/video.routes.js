import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteVideoById, getVideoById, publishAVideo, togglePublishVideo, updateVideo, updateVideoDetails, uploadManyVideos } from "../controllers/video.controller.js";



const router = Router();

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





export default router