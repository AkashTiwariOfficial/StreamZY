import { Subscription } from "../models/subscription.models.js";
import { User } from "../models/user.models.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponses } from "../utils/ApiResponses.js"




const toggleSubscription = asyncHandler(async (req, res) => {

    const { channelId } = req.params

    if (!channelId) {
        throw new ApiErrors(400, "channelId is missing!")
    }

    const userChannel = await User.findById(channelId)

    if (!userChannel) {
        throw new ApiErrors(404, "Channel not found! or Invalid channelId")
    }

    let subsCribe, toggleSubscribe;

    const doUserSubscribedCurrentChannel = await Subscription.findOne({
        subscriber: req.user?._id,
        channel: userChannel?._id,
    })

    if (doUserSubscribedCurrentChannel) {
        if (doUserSubscribedCurrentChannel?.isSubscribed == true) {
            toggleSubscribe = await Subscription.findByIdAndUpdate(doUserSubscribedCurrentChannel._id,
                {
                    $set: {
                        isSubscribed: false
                    }
                }, { new: true }
            )

            if (!doUserSubscribedCurrentChannel) {
                throw new ApiErrors(500, "Internal Server Error while toggling Subscribe")
            }
        }
        if (doUserSubscribedCurrentChannel?.isSubscribed == false) {
            toggleSubscribe = await Subscription.findByIdAndUpdate(doUserSubscribedCurrentChannel._id,
                {
                    $set: {
                        isSubscribed: true
                    }
                }, { new: true }
            )

            if (!doUserSubscribedCurrentChannel) {
                throw new ApiErrors(500, "Internal Server Error while toggling Subscribe")
            }
        }
    }

    if (!doUserSubscribedCurrentChannel) {
        subsCribe = await Subscription.create({
            subscriber: req.user?._id,
            channel: userChannel?._id,
            isSubscribed: true
        })

        if (!subsCribe) {
            throw new ApiErrors(500, "Internal Server Error while Subscripting")
        }
    }

    return res
        .status(200)
        .json(new ApiResponses(200, { subsCribe, toggleSubscribe }))

})


const getUserChannelSubscribers = asyncHandler(async (req, res) => {

    const { channelId } = req.params

    if (!channelId) {
        throw new ApiErrors(400, "channelId is missing!")
    }

    const userChannel = await User.findById(channelId)

    if (!userChannel) {
        throw new ApiErrors(404, "Channel not found! or Invalid channelId")
    }

    const totalSubscriber = await Subscription.find({
        channel: channelId,
        isSubscribed: true
    })

    if (!totalSubscriber) {
        throw new ApiErrors(500, "Internal Server Error while fetching Subscribers of a channel")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, totalSubscriber, "Subscriber's of channel fetched successfully"))

})


const getSubscribedChannels = asyncHandler(async (req, res) => {

    const { subscriberId } = req.params

    if (!subscriberId) {
        throw new ApiErrors(400, "subscriberId is missing!")
    }

    const subsChannel = await User.findById(subscriberId)

    if (!subsChannel) {
        throw new ApiErrors(404, "Channel not found! or Invalid channelId")
    }

    const mySubscribedChannel = await Subscription.find({
        subscriber: subscriberId,
        isSubscribed: true
    })

    if (!mySubscribedChannel) {
        throw new ApiErrors(500, "Internal Server Error while fetching channel Subscribed by user")
    }

    return res
        .status(200)
        .json(new ApiResponses(200, mySubscribedChannel, "channel Subscribed by user fetched successfully"))

})

const getIsSubscribed = asyncHandler(async (req, res) => {

    const { channelId } = req.params

    if (!channelId) {
        throw new ApiErrors(400, "channelId is missing!")
    }

    const userChannel = await User.findById(channelId)

    if (!userChannel) {
        throw new ApiErrors(404, "Channel not found! or Invalid channelId")
    }

    let subscriber;

    const doUserSubscribedCurrentChannel = await Subscription.findOne({
        subscriber: req.user?._id,
        channel: userChannel?._id,
        isSubscribed: true
    })

    if (doUserSubscribedCurrentChannel) {
        subscriber = true;
    } else {
        subscriber = false;
    }

    return res
        .status(200)
        .json(new ApiResponses(200, subscriber, "Feteched successfully"))

})

export {

    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
    getIsSubscribed

}