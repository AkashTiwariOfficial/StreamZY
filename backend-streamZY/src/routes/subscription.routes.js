import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";




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









export default router