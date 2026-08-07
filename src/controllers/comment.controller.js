import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
if (!isValidObjectId(videoId)) {throw new ApiError(400, "Invalid videoId")}
const comment=await Comment.find({video:videoId}).sort({createdAt:-1}).skip((page-1)*limit).
limit(parseInt(limit)).populate("owner","username avatar")
return res.json(new ApiResponse(200, comments, "Comments fetched successfully"))
})

const addComment = asyncHandler(async (req, res) => {

    // TODO: add a comment to a video
     const { videoId } = req.params
    const { content } = req.body

    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid videoId")
    if (!content) throw new ApiError(400, "Comment content is required")

    // Create new comment linked to video and user
    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })

    return res.json(new ApiResponse(201, comment, "Comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params
    const { content } = req.body

    if (!isValidObjectId(commentId)) throw new ApiError(400, "Invalid commentId")
    if (!content) throw new ApiError(400, "Updated content is required")

    // Update comment content and return updated document
    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { content },
        { returnDocument: "after" } // replaces deprecated new:true
    )

    if (!updatedComment) throw new ApiError(404, "Comment not found")

    return res.json(new ApiResponse(200, updatedComment, "Comment updated successfully"))

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
     const { commentId } = req.params

    if (!isValidObjectId(commentId)) throw new ApiError(400, "Invalid commentId")

    const deletedComment = await Comment.findByIdAndDelete(commentId)
    if (!deletedComment) throw new ApiError(404, "Comment not found")

    return res.json(new ApiResponse(200, null, "Comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }