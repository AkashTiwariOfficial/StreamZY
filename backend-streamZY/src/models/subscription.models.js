import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
         subscriber: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
         },
         channel: {
          type: mongoose.Schema.Types.ObjectId,
            ref: "User" 
         },
         isSubscribed: {
            type: Boolean,
            default: false
         }
},{ timestamps: true }
)



export const Subscription = mongoose.model("Subscription", subscriptionSchema)