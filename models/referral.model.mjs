import mongoose from "mongoose";
const referralCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    policy: { type: mongoose.Schema.Types.ObjectId, ref: 'ReferralPolicy', required: true },
    status: { type: String, enum: ['active', 'used', 'expired'], default: 'active' },
    usageCount: { type: Number, default: 0 },
    usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    expirationDate: { type: Date },
    expirationIST:{type:Date}
  }, { timestamps: true });
  
  export default mongoose.model('ReferralCode', referralCodeSchema);
  