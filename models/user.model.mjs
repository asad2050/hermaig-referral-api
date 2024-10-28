import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber:{type:String, required: true, unique: true},
  password: { type: String, required: true },
  referralCode: { type: String},  // User's unique referral code
  referredBy: { type: String }, // Stores the code used to sign up
  rewardPoints: { type: Number, default: 0 },
  isAdmin:{type:Boolean, default: false},  // Points earned from referrals
}, { timestamps: true });

export default mongoose.model('User', userSchema);
