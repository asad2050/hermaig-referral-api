import ReferralCode from "../models/referral.model.mjs";
// import ReferralPolicy from "../models/referralPolicy.model.mjs";
import userInteraction from "../models/userInteraction.model.mjs";
import User from "../models/user.model.mjs";
import { createReferralCode } from "../util/createReferralCode.mjs";
import { DateTime } from "luxon";

export const viewReferral = async (req, res, next) => {
  try {
    const referral = await ReferralCode.findOne({ generatedBy: req.userId }).populate("generatedBy", "name email");
    const userInteractions = await userInteraction.find({ _id:referral.userInteractions}).populate('userId', 'name email');
  

    if (!referral ) {
      const error = new Error("No referrals found");
      error.statusCode = 404;
      throw error;
    }

    const formattedReferral ={
      _id: referral._id,
      code: referral.code,
      generatedBy: referral.generatedBy,
      status: referral.status,
      userInterations: userInteractions,
      // policy: referral.policy,
      // usedBy: referral.usedBy,
      usageCount: referral.usageCount,
      // expirationDateUTC: referral.expirationDate,
      // expirationDateIST: DateTime.fromISO(referral.expirationDate)
      //   .setZone("Asia/Kolkata")
      //   .toISO(),
      createdAt: referral.createdAt,
      updatedAt: referral.updatedAt,
    };

    return res.status(200).json({ referral: formattedReferral });
  } catch (error) {
    next(error);
  }
};

export const generateReferralCode = async (req, res, next) => 
  
  {
  try {
    const userId = req.userId;
    const now = DateTime.now().toUTC().toISO();
    const user = await User.findById(userId);

    // const policy = await ReferralPolicy.findOne({
    //   isActive: true,
    //   expiration: { $gte: now },
    // });
    // if (!policy) {
    //   const error = new Error(
    //     "No active referral policy found or the policy has expired."
    //   );
    //   error.statusCode = 400;
    //   throw error;
    // }


    // const expirationDate = DateTime.now()
    //   .plus({ days: policy.validityPeriod })
    //   .toUTC()
    //   .toISO();
    // const expirationIST = DateTime.fromISO(expirationDate)
    //   .setZone("Asia/Kolkata")
    //   .toISO();
    let finalReferral;
      const existingReferral =await ReferralCode.findOne({ generatedBy: userId });
    if (existingReferral) {
    //   existingReferral.code = referralCode;
    // finalReferral=  await existingReferral.save();
      // console.log(existingReferral);
    return res.status(201).json({ message:"Referral code already generated",referralCode: existingReferral.code });
    }
    
    const referralCode = createReferralCode(user.name);
    console.log(existingReferral);
   
  const newReferralCode = new ReferralCode({
      code: referralCode,
      generatedBy: userId,
      // policy: policy._id,
    });

    await newReferralCode.save();
    
  
     user.referralCode = newReferralCode.code;
   await  user.save();

    return res.status(201).json({ referralCode });
  } catch (error) {
    next(error);
  }
};

export const checkReferralCode = async (req, res, next) => {
  try {
    const now = DateTime.now().toUTC().toISO();

    // const policy = await ReferralPolicy.findOne({
    //   isActive: true,
    //   expiration: { $gte: now },
    // });
    // if (!policy) {
    //   const error = new Error(
    //     "The referral code policy is either expired or terminated."
    //   );
    //   error.statusCode = 404;
    //   throw error;
    // }
    const referralCode = await ReferralCode.findOne({
      code: req.params.code
    });
    if (!referralCode) {
      const error = new Error("The referral code has been expired");
      error.statusCode = 404;
      throw error;
    }

    // const expirationIST = DateTime.fromISO(referralCode.expirationDate)
    //   .setZone("Asia/Kolkata")
    //   .toISO();

    return res.status(201).json({
      isActive: true,
      message: "The code is active and has not expired",
      // expirationDate: referralCode.expirationDate,
      // expirationIST: expirationIST,
    });
  } catch (error) {
    next(error);
  }
};
