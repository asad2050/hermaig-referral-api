import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  phoneNumber:{type:String,  unique: true},
  googleId: {type:String},
  username: {type:String},
  password: { type: String },
  referralCode: { type: String},  
  referredBy: { type: String }, 
  rewardPoints: { type: Number, default: 0 },
  isAdmin:{type:Boolean, default: false},  
  role:{type:String, enum: ['user','influencer', 'admin'], default: 'user'},
}, { timestamps: true });

export default mongoose.model('User', userSchema);
