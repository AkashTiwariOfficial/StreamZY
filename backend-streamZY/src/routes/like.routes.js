import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getLikedVideos, isVideoLiked, toggleLikeAndDisLike, toggleLikeAndDisLikeComment, toggleUserCommentLike, toggleUserTweetLike, toggleUserVideoLike, totalCommentLike, totalLikes, userCommentLike } from "../controllers/like.controller.js";






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

router.route("/fetch-total-comment-like/:commentId").get(
    verifyJWT,
    totalCommentLike
)

router.route("/fetch-total-like/:videoId").get(
    verifyJWT,
    totalLikes
)

router.route("/toggle-comment-like&dislike/:commentId").patch(
    verifyJWT,
    toggleLikeAndDisLikeComment
)


router.route("/toggle-video-like&dislike/:videoId").patch(
    verifyJWT,
    toggleLikeAndDisLike 
)





export default router