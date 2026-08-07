import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content}=req.body
    if(!content){
        throw new ApiError(404,"content is required")
    }
    const tweet=await Tweet.create({content,owner:req.user._id})
    return res.status(200).json(new ApiResponse(200,tweet,"tweet created"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId}=req.params;
    if(!isValidObjectId(userId)){
        throw new ApiError(404,"userid invalid");
    }
    const tweet=await Tweet.findById({owner:userId}).sort({createdAt:-1})
    return res.status(200).json(new ApiResponse(200,tweet,"tweet extracted"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId}=req.params;
    const {content}=req.body;
   if(!isValidObjectId(userId)){
        throw new ApiError(404,"userid invalid");
    }
    if(!content){
        throw new ApiError(404,"content required for update")
    }
    const tweet=await Tweet.findByIdAndUpdate(tweetId,{content},{returnDocument:after})
    return res.status(200).json(new ApiResponse(200,tweet,"tweet updated"))

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId}=req.params;
     if(!isValidObjectId(userId)){
        throw new ApiError(404,"userid invalid");
    }
    await Tweet.findByIdAndDelete(tweetId);
    return res.status(200).json(new ApiResponse(200,{},"tweet deleted"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}