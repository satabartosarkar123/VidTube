import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js";
import {User} from '../models/user.models.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { apiResponse } from '../utils/apiResponse.js';
import fs from 'fs';

const generateAccesAndRefreshToken=async (userId)=>{
    try{
    const user=await User.findById(userId);
    if(!user){
        throw new ApiError(404, "User not found");
    }
    const accessToken=user.generateAuthToken();
    const refreshToken=user.generateRefreshToken();
    user.refreshToken = refreshToken; // Save the refresh token in the user document
    await user.save(); // Save the user document with the new refresh token
    return { accessToken, refreshToken };
    }
    catch(error){ //just incase error in above code
        throw new ApiError(505," Error generating access and refresh tokens", error.message);
    }
}

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

const loginUser=asyncHandler(async(req,res)=>{
    //get data from body
    const{email,username,password}=req.body;
    if(!email){throw new ApiError(400,"email is required")}

    const existingUser=await User.findOne({$or:[{email},{username}]});// find user based on name or email

    if(!user){
        throw new ApiError(404,"User not found with this email or username");
    }

    //validate password
    const isPasswordValid=await existingUser.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(400,"Invalid password");
    }
    //generate access and refresh token
    const { accessToken, refreshToken } = await generateAccesAndRefreshToken(existingUser._id); //create a function to generate tokens
    const loggedInUser=await User.findById(existingUser._id).select("-password");
    if (!loggedInUser) {
        throw new ApiError(500, "Login failed");
    }
    const options={
        httpOnly:true,//user can't modify anymore
        secure: process.env.NODE_ENV === 'production', // Set secure flag in production
    }
    return res
        .status(200)
        .cookie("accessToken",accessToken, options)
        .cookie("refreshToken",refreshToken, options)
        .json(new apiResponse(200,loggedInUser,accessToken,refreshToken,"Userrr login successful"))
    
})

export { registerUser };