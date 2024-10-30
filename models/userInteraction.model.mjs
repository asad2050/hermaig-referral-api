import mongoose from "mongoose";

const userInteractionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  referralCode: {
    type: String,
    required: true,
  },
  interactionType: {
    type: String,
    enum: ['linkClick','signup'],
  },
  interactionDetails: [{
    url: { type: String },         
    timestamp: { type: Date, default: Date.now() }, 
    ISTTimestamp: { type: Date,default:Date.now()+5.5*60*60*1000}
  }],
});

export default mongoose.model('UserInteraction', userInteractionSchema);
