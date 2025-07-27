import mongoose ,{Schema} from mongoose;

const tweetSchema=Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User', // refer to user relation 
    },
    content: {
        type: String,
        required: [true, 'Tweet content is required'],
    },
}, { timestamps: true })

export const Tweet=mongoose.model('Tweet', tweetSchema);