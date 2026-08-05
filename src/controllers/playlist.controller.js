import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    if(!name||!description){
        throw new ApiError(404,"name and description required")
    }
    const playlist=await Playlist.create({
        name,description,owner:req.user._id
    })
    return res.status(200).json(new ApiResponse(200,playlist,"playlist created"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"User id invalid")
    }
    const playlist=await Playlist.findById({owner:userId});
    return res.status(200).json(new ApiResponse(200,playlist,"playlist fetched"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
   if(!isValidObjectId(userId)){
        throw new ApiError(400,"Playlist id invalid")
    }
    const playlist=await Playlist.findById(playlistId).populate("videos");
    return res.status(200).json(new ApiResponse(200,playlist,"playlist fetched"))

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!isValidObjectId(videoId)||!isValidObjectId(playlistId)){
        throw new ApiError(404,"videoid and playlistid invalid")
    }
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) throw new ApiError(404, "Playlist not found")
   if (playlist.videos.some(v => v.toString() === videoId)) {
        return res.json(new ApiResponse(200, playlist, "Video already in playlist"))
    }

    // Add video if not present
    playlist.videos.push(videoId)
    await playlist.save({validateBeforeSave:false})

    return res.json(new ApiResponse(200, playlist, "Video added to playlist"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
  if(!isValidObjectId(videoId)||!isValidObjectId(playlistId)){
        throw new ApiError(404,"videoid and playlistid invalid")
    }
    const playlist=await Playlist.findById(playlistId);
    
        playlist.videos = playlist.videos.filter(v => v.toString() !== videoId)

        await playlist.save({validateBeforeSave:false})
    
    return res.status(200).json(new ApiResponse(200,playlist,"Video delete successfully"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError(404,"playlistid is invalid")
    }
    const playlist=await Playlist.findByIdAndDelete(playlistId);
    return res.status(200).json(
     new ApiResponse(200,{},"playlist delete")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    
    if (!isValidObjectId(playlistId)) throw new ApiError(400, "Invalid playlistId")

    const updates = {}
    if (name) updates.name = name
    if (description) updates.description = description

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        updates,
        { returnDocument: "after" } // ✅ replaces deprecated new:true
    )

    if (!updatedPlaylist) throw new ApiError(404, "Playlist not found")

    return res.json(new ApiResponse(200, updatedPlaylist, "Playlist updated successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}