import { Router } from "express";
import { changePassword, deleteAccount, fetchUserVideos, getCurrentUser, getUserChannel, getUserWatchHistory, logoutUser, otpVerification, refreshAccessandRefreshTokens, registerUser, sendOtp, upadteAvatar, upadtecoverImage, updateAccountDetails } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)

// secured routes 
router.route("/logout").post(
    verifyJWT,
    logoutUser
)

router.route("/refresh-token").post(refreshAccessandRefreshTokens)

router.route("/request-password-reset").post(
    verifyJWT,
    changePassword
)

router.route("/account-details").get(
    verifyJWT,
    getCurrentUser
)

router.route("/update-account").patch(
    verifyJWT,
    updateAccountDetails
)

router.route("/avatar").patch(
    verifyJWT,
    upload.single("avatar"),
    upadteAvatar
)

router.route("/cover-image").patch(
    verifyJWT,
    upload.single("coverImage"),
    upadtecoverImage
)

router.route("/delete").delete(
    verifyJWT,
    deleteAccount
)

router.route("/send-otp").post(
    verifyJWT,
    sendOtp
)

router.route("/verify-otp").patch(
    verifyJWT,
    otpVerification
)

router.route("/c/:username").get(
    verifyJWT, 
    getUserChannel
)

router.route("/watch-history").get(
    verifyJWT,
    getUserWatchHistory
)

router.route("/fetch-videos/:username").get(
    verifyJWT,
    fetchUserVideos
)


export default router