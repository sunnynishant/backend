import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB=async()=>{
    try{
 const connectioninstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
 console.log(`\n MONGODB CONNECTED:${connectioninstance.connection.host}`);
    }
    catch(error){
        console.log("MONGODB conmnection error :",error);
        process.exit(1);
    }
}
export default  connectDB