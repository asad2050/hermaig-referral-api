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
    if(!user.rewardPoints ){
      return res.status(200).json({
        rewards: [],
      });}
    return res.status(200).json({
      rewardPoints: user.rewardPoints,
      referral
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while retrieving rewards" });
  }
};

export const  storeUserInteractions=async(req,res,next)=>{
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    // Extract necessary data from the request body or params
    const { interactionType, interactionDetails } = req.body;
    
    const userId = req.userId;
    const user = await User.findById(userId);
    // Validate required fields
    if (!userId || !interactionType) {
      return res.status(400).json({ error: 'User ID and interaction type are required.' });
    }
    // Create a new interaction entry
    const newInteraction = new UserInteraction({
      userId,
      interactionType,
      referralCode: user.referredBy,
      interactionDetails: interactionDetails,
      timestamp: new Date() // add the current timestamp
    });

    // Save interaction in the database
    // const savedInteraction = await newInteraction.save();
    const referral= await ReferralCode.findOne({ code: user.referredBy });
    if(referral){
      referral.usageCount = referral.usageCount + 1;
      referral.userInteractions=[...referral.userInteractions,newInteraction];
      console.log(referral)
      await referral.save();
    }
 

    // Respond with success message and saved data
    res.status(201).json({
      message: 'User interaction stored successfully.',
      interaction: newInteraction
    });
  } catch (error) {
    // Handle errors (e.g., database errors)
    console.error('Error storing user interaction:', error);
    res.status(500).json({ error: 'Failed to store user interaction.' });
  }
}