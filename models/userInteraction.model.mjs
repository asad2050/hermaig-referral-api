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
    timestamp: { type: Date }, 
    ISTTimestamp: { type:Date,}
  }],
});

export default mongoose.model('UserInteraction', userInteractionSchema);
