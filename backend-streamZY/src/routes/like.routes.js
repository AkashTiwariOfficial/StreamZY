import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getLikedVideos, isVideoLiked, toggleUserCommentLike, toggleUserTweetLike, toggleUserVideoLike, userCommentLike } from "../controllers/like.controller.js";






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
    toggleUserCommentLike
)

router.route("/fetch-user-likes-videos").get(
    verifyJWT,
    getLikedVideos
)

router.route("/fetch-user-like/:videoId").get(
    verifyJWT,
    isVideoLiked
)

router.route("/fetch-user-comment-like/:commentId").get(
    verifyJWT,
    userCommentLike
)





export default router