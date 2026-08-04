import mongoose,{Schema} from "mongoose";
const likeSchema=new Schema({
    video:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    },
    comment:{
        type:Schema.Types.ObjectId,
        ref:"comment"
    },
    likedBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
},{timeStamps:true})
export const Like=mongoose.model("Like",likeSchema)