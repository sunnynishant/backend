import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

//  Toggle like on a video
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid videoId")

    // Check if user already liked this video
    const existingLike = await Like.findOne({ video: videoId, likedBy: req.user._id })

    if (existingLike) {
        // If like exists → remove it (unlike)
        await existingLike.deleteOne()
        return res.json(new ApiResponse(200, null, "Video unliked"))
    }

    // Otherwise → create a new like
    const newLike = await Like.create({ video: videoId, likedBy: req.user._id })
    return res.json(new ApiResponse(201, newLike, "Video liked"))
})

//  Toggle like on a comment
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    if (!isValidObjectId(commentId)) throw new ApiError(400, "Invalid commentId")

    const existingLike = await Like.findOne({ comment: commentId, likedBy: req.user._id })

    if (existingLike) {
        await existingLike.deleteOne()
        return res.json(new ApiResponse(200, null, "Comment unliked"))
    }

    const newLike = await Like.create({ comment: commentId, likedBy: req.user._id })
    return res.json(new ApiResponse(201, newLike, "Comment liked"))
})

//  Toggle like on a tweet
const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    if (!isValidObjectId(tweetId)) throw new ApiError(400, "Invalid tweetId")

    const existingLike = await Like.findOne({ tweet: tweetId, likedBy: req.user._id })

    if (existingLike) {
        await existingLike.deleteOne()
        return res.json(new ApiResponse(200, null, "Tweet unliked"))
    }

    const newLike = await Like.create({ tweet: tweetId, likedBy: req.user._id })
    return res.json(new ApiResponse(201, newLike, "Tweet liked"))
})

// ✅ Get all liked videos of the logged-in user
const getLikedVideos = asyncHandler(async (req, res) => {
    // Find all likes where user liked a video
    const likes = await Like.find({ likedBy: req.user._id, video: { $exists: true } })
        .populate("video") // populate video details

    return res.json(new ApiResponse(200, likes, "Liked videos fetched successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
