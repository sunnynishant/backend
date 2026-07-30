import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema=new Schema({
    videoFile:{
        type:String,
        requiired:true,
    },
    thumbnail:{
        type:String,
        requiired:true,
    },
    title:{
        type:String,
        requiired:true,
    },
    description:{
        type:String,
        requiired:true,
    },
    duration:{
        type:Number,//cloudinary
    },
    views:{
        type:Number,
        default:0
    },isPublished:{
        type:Boolean,
        default:true
    },
    owner:
    {
        type:Schema.Types.Objectid,
        ref:'User'
    }
},{timestamps:true})
videoSchema.plugin(mongooseAggregatePaginate)
export const Video=mongoose.model("Video",videoSchema)