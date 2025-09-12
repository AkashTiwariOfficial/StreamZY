import { Tweet } from "../models/tweet.models.js";
import { User } from "../models/user.models.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponses } from "../utils/ApiResponses.js";
import { asyncHandler } from "../utils/asyncHandler.js";






const createTweet = asyncHandler(async (req, res) => {

    const { comment } = req.body

    if (!comment) {
        throw new ApiErrors(400, "Tweet content is requried!")
    }

    const createdTweet = await Tweet.create({
        owner: req.user?._id,
        comment
    })

    if (!createdTweet) {
        throw new ApiErrors(500, "Internal Server Error whiel creating tweet")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, createdTweet, "Tweet created successfully"))

})


const getAlltweets = asyncHandler(async (req, res) => {

     const { page = 1, limit = 10, sortBy = "createdAt", sortType = "desc" } = req.query

    const limitNumber = parseInt(limit, 10)
    const pageNumber = parseInt(page, 10)

    const sort = {}

    if (sortBy) {
        sort[sortBy] = sortType === "desc" ? -1 : 1;
    }

    const fetchAllTweet = await Tweet.find()
        .sort(sort)
        .skip((pageNumber - 1) * 10)
        .limit(limitNumber)

        if (fetchAllTweet.length === 0 ) {
            throw new ApiErrors(404, "No tweets found!")
        }

        if (!fetchAllTweet) {
            throw new ApiErrors(500, "Internal Server Error while feching  tweets")
        }

        return res
        .status(200)
        .json(new ApiResponses(200, fetchAllTweet, "User's Tweets were fetched successfully" ))

})


const getmyTweets = asyncHandler( async ( req, res ) => {

    const myTweets = await Tweet.find({owner: req.user?._id})

    if (myTweets.length === 0) {
        throw new ApiErrors(404, "No tweets found!")
    }

    if (!myTweets) {
        throw new ApiErrors(500, "Internal Server Error while fetching Tweets")
    }

    return res
    .status(200)
    .json(new ApiResponses(200, myTweets, "Tweets fetched Successfully"))

})


const getUserstweets = asyncHandler(async (req, res) => {

    const { userId } = req.params

    const { page = 1, limit = 10, sortBy = "createdAt", sortType = "desc" } = req.query

    const limitNumber = parseInt(limit, 10)
    const pageNumber = parseInt(page, 10)

    const sort = {}

    if (sortBy) {
        sort[sortBy] = sortType === "desc" ? -1 : 1;
    }

    if (!userId) {
        throw new ApiErrors(400, "userId is missing!")
    }

    const isUserValid = await User.findById(userId)

    if (!isUserValid) {
        throw new ApiErrors(400, "User not found!")
    }

    const fetchUsersTweet = await Tweet.find({ owner: userId })
        .sort(sort)
        .skip((pageNumber - 1) * 10)
        .limit(limitNumber)

        if (fetchUsersTweet.length === 0 ) {
            throw new ApiErrors(404, "No tweets found!")
        }

        if (!fetchUsersTweet) {
            throw new ApiErrors(500, "Internal Server Error while feching user's tweets")
        }

        return res
        .status(200)
        .json(new ApiResponses(200, fetchUsersTweet, "User's Tweets were fetched successfully" ))

})


const updateTweet = asyncHandler(async (req, res) => {

    const { tweetId } = req.params

    if (tweetId) {
        throw new ApiErrors(400, "Tweet id is missing!")
    }

    const isTweetValid = await Tweet.findById(tweetId)

    if (!isTweetValid) {
        throw new ApiErrors(404, "Tweet not found!")
    }

    const { comment } = req.body

    if (!comment) {
        throw new ApiErrors(400, "Tweet content is requried!")
    }

    const newTweetComment = await Tweet.findByIdAndUpdate(tweetId, {
        $set: {
            comment: comment
        }
    }, { new: true }
    )

    if (!newTweetComment) {
        throw new ApiErrors(500, "Internal Server Error while updating Tweet")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, newTweetComment, "Tweet updated successfully"))

})


const deleteTweet = asyncHandler(async (req, res) => {

    const { tweetId } = req.params

    if (!tweetId) {
        throw new ApiErrors(400, "Tweet id is missing!")
    }

    const isTweetValid = await Tweet.findById(tweetId)

    if (!isTweetValid) {
        throw new ApiErrors(404, "Tweet not found!")
    }

    const deleteByIdTweet = await Tweet.findByIdAndDelete(tweetId)

    if (!deleteByIdTweet) {
        throw new ApiErrors(500, "Internal Server Error while deleting tweet")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, {}, "Tweet was deleted successfully"))

})






export {
createTweet,
getAlltweets,   
getmyTweets,
getUserstweets,
updateTweet,
deleteTweet
}