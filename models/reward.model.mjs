 import mongoose from "mongoose";
const rewardSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    referralCode: { type: mongoose.Schema.Types.ObjectId, ref: 'ReferralCode', required: true },
    pointsAwarded: { type: Number, required: true },
    redeemed: { type: Boolean, default: false },
  }, { timestamps: true });
  
  export default mongoose.model('Reward', rewardSchema);
  