import mongoose from "mongoose";
const referralPolicySchema = new mongoose.Schema({
  name:{type:String, required: true},
    rewardPoints: { type: Number, required: true },
    validityPeriod: { type: Number, default: 30 }, // in days
    isActive: { type: Boolean, default: true },
    expiration: { type: Date , default: Date.now()+30*24*60*60*1000},
    expirationIST: { type: Date },
  }, { timestamps: true });
  
 export default mongoose.model('ReferralPolicy', referralPolicySchema);
