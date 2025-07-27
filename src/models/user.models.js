// setting user model


/*
id String pk --> auto added by Mongo
username String
email String
password String
fullName String
avatar String
coverImage String 
watchHistory ObjectId[] videos
refreshToken String
createdAt Date
updatedAt Date
*/ 

import mongoose ,{Schema} from "mongoose";

const userSchema=new Schema({
    username:{ // we could write username: String, but we want to add more properties
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
    }//how? read docs!!
    ,
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: [true, 'Password is required'],//if password is not given it passes this string
        trim: true,
    },
    fullname:{
        type: String,
        required: true,
        trim: true,
        index: true,//creates indexing
    },
    avatar:{
        type: String,
        required: true,
    },
    coverImage:{
        type: String,
    },
    watchHistory: [{
        type: Schema.Types.ObjectId,
        ref: 'Video' // assuming you have a Video model
    }],
    refreshToken:{
        type: String,
    },
}, {timestamps:true}//this automatically gives created and updated at time by mongoose
)

import bcrypt from 'bcryptjs';
//use hooks to do some middleware 
userSchema.pre('save',async function(next){
    //next is always given as it passes the context to the next middleware
    if(!this.modified("password")) return next() //if password is not modified then we don't need to hash it again
    this.password=bcrypt.hash(this.password,10)//this means userSchema Object
    next()
})
userSchema.methods.isPasswordCorrect=async function (password){
    return await bcrypt.compare(password,this.password);//no need to tell how many rounds...it knows 
}


import jwt from jsonwebtoken
userShema.methods.generateAuthToken=function(){
    jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname,
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn:ACCESS_TOKEN_TIME})
}
userShema.methods.generateRefreshToken=function(){
    jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname,
    },process.env.REFRESH_TOKEN_SECRET,{expiresIn:REFRESH_TOKEN_TIME})
}



export const User = mongoose.model('User', userSchema);