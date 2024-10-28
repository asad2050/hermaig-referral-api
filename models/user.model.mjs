import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber:{type:String, required: true, unique: true},
  password: { type: String, required: true },
  referralCode: { type: String},  
  referredBy: { type: String }, 
  rewardPoints: { type: Number, default: 0 },
  isAdmin:{type:Boolean, default: false},  
}, { timestamps: true });

export default mongoose.model('User', userSchema);
