import mongoose ,{Schema} from mongoose;

const likeSchema=Schema({
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment', // refer to comment relation
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // refer to user relation 
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: 'Tweet'
    },
    playlist: {
        type: Schema.Types.ObjectId,
        ref: 'Playlist'
    },
}, { timestamps: true })

export const Like=mongoose.model('Like', likeSchema);