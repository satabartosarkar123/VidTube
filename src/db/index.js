import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";


//function to connect to the database
const connectDB=async () => {
try{
    await mongoose.connect(`${process.env.MONGO_URI}`)
    console.log("Database connected successfully");
    console.log(`DB HOST : ${mongoose.connection.host}`);
}catch(error){
    console.log(error)
}
};

export default connectDB;