import User from "../models/user.model.mjs";
import ReferralCode from "../models/referral.model.mjs";
import UserInteraction from "../models/userInteraction.model.mjs";
import { validationResult } from "express-validator";
export const getUserRewards = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("rewardPoints");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const referral = await ReferralCode.findOne({ generatedBy: userId });
    if (!user.rewardPoints) {
      return res.status(200).json({
        rewards: [],
      });
    }
    return res.status(200).json({
      rewardPoints: user.rewardPoints,
      referral,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while retrieving rewards" });
  }
};

export const storeUserInteractions = async (req, res, next) => {
  console.log("Request received at:", new Date().toISOString());

  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    
    const { interactionType, interactionDetails } = req.body;

    const userId = req.userId;
    const user = await User.findById(userId);
    
    if (!userId || !interactionType) {
      return res
        .status(400)
        .json({ error: "User ID and interaction type are required." });
    }
    
    const newInteraction = new UserInteraction({
      userId,
      interactionType,
      referralCode: user.referredBy,
      interactionDetails: interactionDetails,
    });
    
    console.log(newInteraction)
    // newInteraction.save();
    
    
    // const referral = await ReferralCode.findOne({ code: user.referredBy });
    // if (referral) {
    //   referral.userInteractions = [
    //     ...referral.userInteractions,
    //     newInteraction,
    //   ];
    //   await referral.save();
    // }

    
    res.status(201).json({
      message: "User interaction stored successfully.",
      interaction: newInteraction,
    });
  } catch (error) {
    
    console.error("Error storing user interaction:", error);
    res.status(500).json({ error: "Failed to store user interaction." });
  }
};
export const storeGoogleUserInformation = async (req, res, next) => {
  try {
    let referredByUser = null;
    let referralCode = null;
   let role = req.body.role;
    if (req.body.referredByCode) {
      referralCode = await ReferralCode.findOne({
        code: req.body.referredByCode,
      });
      if (!referralCode) {
        errorData.push("Referral code is invalid.");
      }
      referredByUser = await User.findById(referralCode.generatedBy);
      if (!referredByUser) {
        errorData.push("Referrer doesn't exist.");
      }
    }
    const userId = req.userId;
    
    if (role !== "user" && role !== "influencer") {
      role='user';
    }
    const savedUser = await User.findByIdAndUpdate(
      userId,
      { role, referredBy: referralCode.code || ''},
      { new: true }
    );
    const userInteraction = new UserInteraction({
      userId: savedUser._id,
      interactionType: "signup",
      referralCode: referralCode.code ||'',
    });
    // console.log(savedUser)
    // console.log(userInteraction)
    // console.log(referralCode)
    if (referralCode) {
      const responseUserInterationSave = await userInteraction.save();
      referralCode.usedBy.push(savedUser._id);
      referralCode.userInteractions.push(responseUserInterationSave._id);
      referralCode.usageCount += 1;
      await referralCode.save();
      referredByUser.rewardPoints += 10;
      await referredByUser.save();
    }
    res.status(201).json({ message: "role updated", userId: savedUser._id });
  } catch (error) {
    
    console.error("Error storing user interaction:", error);
    res.status(500).json({ error: "Failed to store role and referredBy code" });
  }
};
