//using jwt to verify he stuffs

import jwt from 'jsonwebtoken';
import {User} from '../models/user.models.js';
import {ApiError} from '../utils/ApiError.js';
import {asyncHandler} from "../utils/asyncHandler.js"

export const verifyJWT=asyncHandler(async(req,_,next)=>{
    // we don't have any response to send ...so replace it by _
    // after execution for the passig it on, next is important
    const token = req.cookies.accessToken||req.body.accessToken||req.headers("Authorization")?.replace("Bearer ","") //grab the token, it may be sent via cookies, body or headers 
    if(!token){
        return next(new ApiError(401,"You are not logged in"));
    }
    try{
        const decodedtoken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET); // verify the token using the secret key
        const user=await User.findById(decodedtoken.id); // find the user by id in the token
        if(!user){
            return next(new ApiError(401,"The user belonging to this token does not exist"));
        }

        req.user=user; // attach the user to the request object
        next(); // call the next middleware or route handler or whoever is next in the chain
    }catch(error){
        return next(new ApiError(401,"Invalid token, please login again"));// if the token is invalid or expired, send an error
    }

})