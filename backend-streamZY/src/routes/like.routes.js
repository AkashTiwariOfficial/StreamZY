import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getLikedVideos, toggleUserTweetLike, toggleUserVideoLike } from "../controllers/like.controller";






const router = Router();

router.route("/toggle-video-like/:videoId").patch(
    verifyJWT,
    toggleUserVideoLike
)

router.route("/toggle-tweet-like/:tweetId").patch(
    verifyJWT,
    toggleUserTweetLike
)

router.route("/toggle-comment-like/:commentId").patch(
    verifyJWT,
    toggleUserTweetLike
)

router.route("/fetch-user-likes-videos").patch(
    verifyJWT,
    getLikedVideos
)






export default router