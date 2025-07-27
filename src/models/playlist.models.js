import mongoose ,{Schema} from mongoose;

const playListSchema=Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User', // refer to user relation 
    },
    videos: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Video' }]
    }//Array of objects of form :{ type: Schema.Types.ObjectId, ref: 'Video' }
    ,name:{
        type: String,
        required: [true, 'Playlist name is required'],
    },
    description: {
        type: String,
        required: [true, 'Playlist description is required'],
    },
}, { timestamps: true })

export const Playlist=mongoose.model('Playlist', playListSchema);