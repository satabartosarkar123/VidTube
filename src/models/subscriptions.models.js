import mongoose ,{Schema} from mongoose;

const subscriptionSchema=Schema({
    subscriber: {// subscribes
        type: Schema.Types.ObjectId,
        ref: 'User', // refer to user relation 
    },
    channel: {//being subscribed
        type: Schema.Types.ObjectId,
        ref: 'User', // refer to user relation 
    },
}, { timestamps: true })

export const Subscription=mongoose.model('Subscription', subscriptionSchema);