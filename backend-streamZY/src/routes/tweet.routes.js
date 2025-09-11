import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getAlltweets, getmyTweets, getUserstweets, updateTweet } from "../controllers/tweet.controller.js";




const router = Router();


router.route("/getAll-tweets").get(
    verifyJWT,
    getAlltweets
)

router.route("/users-tweets/:userId").get(
    verifyJWT,
    getUserstweets
)

router.route("/mytweets").get(
    verifyJWT,
    getmyTweets
)

router.route("/add-tweet").post(
    verifyJWT,
    createTweet
)

router.route("/update-tweet/:tweetId").patch(
    verifyJWT,
    updateTweet
)

router.route("/delete-tweet/:tweetId").delete(
    verifyJWT,
    deleteTweet
)




export default router