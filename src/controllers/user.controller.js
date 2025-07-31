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

import jwt from 'jsonwebtoken';

const logoutUser=asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {$set:{refreshToken:undefined}},
        {new: true}
    ); // clear the refresh token in the database by setting it to undefined
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set secure flag in production
    }
    return res
        .status(200) // send a 200 OK response
        .cookie("accessToken", "", options) // clear the access token cookie
        .cookie("refreshToken", "", options) // clear the refresh token cookie
        .json(new apiResponse(200, null, "User logged out successfully"));
})

const refreshAccessToken=asyncHandler(async (req, res) => {
    const incomingRefreshToken=req.cookies.refreshToken;
    if(!incomingRefreshToken){
        throw new ApiError(401, "Refresh token is required");
    }

    try{
        const decodedToken=jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user=await User.findById(decodedToken?._id) // the ? is to handle the case if it is not found
        if(!user){
            throw new ApiError(401,"Invalid Refresh Token")
        }
        //now task is to validate this refresh token matches the refreshtoen copy saved in database or not

        if(incomingRefreshToken!==user?.refreshToken){
            throw new ApiError(401,"Invalid Refresh Token")
        }
        //generate new access token
        const opion={
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production', // Set secure flag in production
        }
        const{accessToken, refreshToken:newRefreshToken}=await generateAccesAndRefreshToken(user._id)
        return res
        .status(200)
        .cookie("accessToken", accessToken, opion)
        .cookie("refreshToken", newRefreshToken, opion)
        .json(new apiResponse(200, {accessToken, newRefreshToken}, "Refresh token generated successfully"))
    }   
    catch(error) {
        throw new ApiError(401, "some issue in generating refresh token");
    }

})

const changeCurrentPassword=asyncHandler(async (req,res)=>{
    //grab old and new pass
    const{oldPassword,newPassword}=req.body; //get the passwords from the request...
    const user=await User.findById(req.user?._id);//get hold of user

    const isPasswordValid=await user.isPasswordCorrect(oldPassword); //check old password is even valid or not
    if(!isPasswordValid){
        throw new ApiError(401,"wrong password(old) entered.")
    }
    user.password=newPassword;//else update the password
    await user.save({validateBeforeSave:false})

})

const getCurrentUser=asyncHandler(async (req,res)=>{
    return res.status(200).json(new apiResponse(200,req.user,"current User Details"))
})
const updateAccountDetails=asyncHandler(async (req,res)=>{
    const {fullname,email}=req.body
    if (!fullname){
        throw new ApiError(400,"Fullname is required")
    }
    if (!email){
        throw new ApiError(400,"email is required")
    }
    const user= await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullname,
                eail:email.toLowerCase()
            }
        },{new:true}
    ).select("-password -refreshToken") //just updated user is grabbed

    return res.status(200).json(new apiResponse(200,user,"Account etails updated "))

})

const updateUserAvatar=asyncHandler(async (req,res)=>{
    const avatarLocalPath=req.file?.path // we are getting the path of the uploaded file
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required")
    }
    const avatar=await uploadOnCloudinary(avatarLocalPath); //retrurns the avatar object
    if(!avatar.url){
        throw new ApiError(500 , "something went wrong in upload")
    }

    await Use.findByIdAndUpdate(
        req.user?._id,{
            $set:{avatar:avatar.url}
        },{new:true}
    ).select("-password -refreshToken")

    return res.status(200).json(new apiResponse(200,avatar,"Avatar updated"))
})
const updateUserCoverImage=asyncHandler(async (req,res)=>{
    const coverImageLocalPath=req.file?.path // we are getting the path of the uploaded file
    if(!coverImageLocalPath){
        throw new ApiError(400,"Cover Image is required")
    }

    const coverImage=await uploadOnCloudinary(coverImageLocalPath); //retrurns the avatar object
    if(!coverImage.url){
        throw new ApiError(500 , "something went wrong in upload")
    }

    await Use.findByIdAndUpdate(
        req.user?._id,{
            $set:{coverImage:coverImage.url}
        },{new:true}
    ).select("-password -refreshToken")

    return res.status(200).json(new apiResponse(200,coverImage,"Cover Image updated"))
})


export { registerUser,loginUser,refreshAccessToken,logoutUser,changeCurrentPassword,getCurrentUser,updateAccountDetails,updateUserAvatar,updateUserCoverImage};