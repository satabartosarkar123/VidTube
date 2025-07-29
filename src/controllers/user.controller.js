import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js";
import {User} from '../models/user.models.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { apiResponse } from '../utils/apiResponse.js';
import fs from 'fs';

const registerUser = asyncHandler(async (req, res) => {
    const {fullname,email,username,password}=req.body;
    if(
        [fullname,email,username,password].some(field => (field?.trim()===""))
    ){
        throw new ApiError(400,"All fields are required")
    }
    //check if user already exists
    const existingUser = await User.findOne({
        $or: [
            { email },
            { username }
        ]
    })
    if(existingUser){
        throw new ApiError(400,"User already exists with this email or username")
    }
    console.warn(req.files)
    const avatarLocalPath=req.files?.avatar?.[0]?.path;
    const coverLocalPath=req.files?.coverImage?.[0]?.path;
    if(!avatarLocalPath || !coverLocalPath) {
        throw new ApiError(400, "Both avatar and cover image are required");
    }

    let avatar;
    try{
        avatar=await uploadOnCloudinary(avatarLocalPath)
        console.log(avatar)
    }catch(error){
        console.log(error);
        throw new ApiError(500, "Failed to upload images to cloudinary");
    }

    let coverImage;
    try{
        coverImage=await uploadOnCloudinary(coverLocalPath)
        console.log(coverImage)
    }catch(error){
        console.log(error);
        throw new ApiError(500, "Failed to upload images to cloudinary");
    }

    if (!avatar || !coverImage) {
        throw new ApiError(500, "Failed to upload images to cloudinary");
    }

    const user = await User.create({
        fullname,
        email,
        username,
        password,
        avatar: avatar.url,
        coverImage: coverImage.url
    })
    const createduser=await User.findById(user._id).select("-password ");
    if (!createduser) {
        throw new ApiError(500, "User creation failed");
    }

    // File cleanup: remove the local files after upload
    if (fs.existsSync(avatarLocalPath)) {
        fs.unlinkSync(avatarLocalPath);
    }
    if (fs.existsSync(coverLocalPath)) {
        fs.unlinkSync(coverLocalPath);
    }

    return res.status(201)
        .json(new apiResponse(201, createduser, "User registered successfully"));
})

export { registerUser };