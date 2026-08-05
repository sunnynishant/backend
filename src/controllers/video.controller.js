import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import uploadOnCloudinary from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query

    // 1. Build filter
    const filter = {}
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ]
    }
    if (userId && isValidObjectId(userId)) {
        filter.owner = userId
    }

    // 2. Build sort
    const sortOptions = {}
    sortOptions[sortBy] = sortType === "asc" ? 1 : -1

    // 3. Use aggregate with pagination
    const aggregate = Video.aggregate([{ $match: filter }, { $sort: sortOptions }])
    const options = { page: parseInt(page), limit: parseInt(limit) }
    const videos = await Video.aggregatePaginate(aggregate, options)

    return res.json(new ApiResponse(200, videos, "Videos fetched successfully"))
})
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    if(!title||!description){
        throw new ApiError(400,"title and description both field required")
    }
    console.log(title)
    if(!req.files?.videoFile||!req.files?.thumbnail){
        throw new ApiError(401,"videofilepath and thumbnail is required")
    }
    const localvideofilepath=req.files?.videoFile[0].path;
    const localthumbnailpath=req.files?.thumbnail[0].path;
    const videoFile=await uploadOnCloudinary(localvideofilepath);
     const thumbnail=await uploadOnCloudinary(localthumbnailpath);
     if(!videoFile||!thumbnail){
         throw new ApiError(401,"videofilepath and thumbnail is required","error on uploading in cloudinary")
     }
     const video=await Video.create({
        title,description,videoFile:videoFile.url,
        thumbnail:thumbnail.url,duration:videoFile.duration||0,owner:req.user?._id
     })
     return res.status(200).json(new ApiResponse(200,video,"video uploaded successfully"));
    // TODO: get video, upload to cloudinary, create video
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
   if(!isValidObjectId(videoId)){
        throw new ApiError(400,"VideoId invalid")
    }
    const video=await Video.findById(videoId).populate("owner","username email");
    if(!video){
        throw new ApiError(400,"Video not found")
    }
    return res.status(200).json(new ApiResponse(
        200,video,"fetched succeessfully"
    ))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
     if(!isValidObjectId(videoId)){
        throw new 
        ApiError(400,"VideoId invalid")
    }
    const {newtitle,newdescription}=req.body;
    const update={}
    if(newtitle){
        update.title=newtitle;
    }
    if(newdescription){
        update.description=newdescription;
    }
    if(req.file?.thumbnail){
        const upload=await uploadOnCloudinary(req.file?.thumbnail[0].path);
        if(!upload){
            throw new ApiError(404,"problem on uploading on cloudinary")
        }
        update.thumbnail=upload.url;
    }
    const video=await Video.findByIdAndUpdate(videoId,update,{returnDocument: "after"})
    return res.status(200).json(
        new ApiResponse(200,video,"video updated successfully")
    )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if(!isValidObjectId(videoId)){
        throw new 
        ApiError(400,"VideoId invalid")
    }
    const deletevideo=await Video.findByIdAndDelete(videoId);
    return res.status(200,null,"Video dleted Successfully")
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new 
        ApiError(400,"VideoId invalid")
    }
    const video=await Video.findById(videoId);
    video.isPublished=!video.isPublished;
    await video.save({validateBeforeSave:false}
    )
    return res.status(200).json(new ApiResponse(200,video,"toggle status successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}