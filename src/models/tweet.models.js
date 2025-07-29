import mongoose, { Schema } from 'mongoose'; // fixed import

const tweetSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User', // refer to user relation 
        required: true // ensure owner is required
    },
    content: {
        type: String,
        required: [true, 'Tweet content is required'],
    },
}, { timestamps: true });

export const Tweet = mongoose.model('Tweet', tweetSchema);