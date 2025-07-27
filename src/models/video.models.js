/*
owner: ObjectID users
videoFile: String
thumbnai; String
title String
description :string
duration : string
isPublished boolean
createdAt,
Updated at
*/

import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

import mongoose ,{Schema} from 'mongoose';

const videoSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
    },
    videoFile: {
        type: String,
        required: [true, 'Video file is required'],
    },
    thumbnail: {
        type: String,
        required: [true, 'Thumbnail is required'],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
    },
    views:{
        type: Number,
        required: [true, 'Views count is required'],
        default:0,
    },
    duration:{
        type: Number,
        required: [true, 'duration is required'],
    }, isPublished: {
        type: Boolean,
        default: false,
    }, owner: {
        type: Schema.Types.ObjectId,
        ref: "User",//refer to user table
    }
}, {timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate); // it simply inects pligin

export const Video = mongoose.model('Video', videoSchema);