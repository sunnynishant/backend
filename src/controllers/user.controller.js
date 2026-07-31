import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import ApiResponse from "../utils/ApiResponse.js"
const registerUser=asyncHandler(async (req,res)=>{
 //get user detail from frontend
 //validation-not empty
 //check if user already registered:username,email
 //check for image,check for avatar
 //upload them to cloudinary,avatar
 //create user object -create entry in db
 //remove password and refresjh tokenfield from response
 //check for user creation
 //return response
 const {fullName,email,username,password}=req.body;
 console.log(email);
 if([fullName,email,username,password].some((field)=>field?.trim()==="")){
 throw new ApiError(400,"All fields are include")
 }
const existinguser=User.findOne({
    $or:[{username},{email}]
 })
 if(existinguser){
    throw new ApiError(409,
        "user with email or username already exists"
    )
    const avatarLocalPath=req.files?.avatar[0]?.path
    const coverImagelocalpath=req.files?.coverImage[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }
    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImagelocalpath)
    if(!avatar){
throw new ApiError(409,"avatar file is require")}
    const user=await User.create({fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,password,username:username.toLowerCase()}
    )
    const check=await User.findById(user._id).select("-password -refreshToken")
    if(!check){
        throw new ApiError(500,"something went wrong")
    }
return res.status(201).json(
    new ApiResponse(200,check,"user registered successfully")
)
 }
})
export default registerUser;