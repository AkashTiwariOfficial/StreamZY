import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getIsSubscribed, getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";




const router = Router();



router.route("/toggleSubcscribe/:channelId").patch(
    verifyJWT,
    toggleSubscription
)

router.route("/subscribers/:channelId").get(
    verifyJWT,
    getUserChannelSubscribers
)

router.route("/subscribed-channel/:subscriberId").get(
    verifyJWT,
    getSubscribedChannels
)

router.route("/isSubscribed/:channelId").get(
    verifyJWT,
    getIsSubscribed
)









export default router