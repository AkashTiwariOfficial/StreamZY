import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { channelStats, getChannelVideos } from "../controllers/dashboard.controller.js";






const router = Router();


router.route("/channel-stats").get(
    verifyJWT,
    channelStats
)

router.route("/channel-vidoes").get(
    verifyJWT,
    getChannelVideos
)




export default router