import mongoose ,{Schema} from mongoose;
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const commentSchema=Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User', // refer to user relation 
    },
    video: {
        type: Schema.Types.ObjectId, ref: 'Video'
    },
    content: {
        type: String,
        required: [true, 'Comment content is required'],
    }
}, { timestamps: true })

commentSchema.plugin(mongooseAggregatePaginate);
export const Comment=mongoose.model('Comment', commentSchema);