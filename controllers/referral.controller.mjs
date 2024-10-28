import ReferralCode from "../models/referral.model.mjs";
import ReferralPolicy from "../models/referralPolicy.model.mjs";
import { createReferralCode } from "../util/createReferralCode.mjs";
import { DateTime } from "luxon";

export const viewAllReferrals = async (req, res, next) => {
  try {
    const referrals = await ReferralCode.find({ generatedBy: req.userId });

    if (!referrals || referrals.length === 0) {
      const error = new Error("No referrals found");
      error.statusCode = 404;
      throw error;
    }

    const formattedReferrals = referrals.map((referral) => ({
      _id: referral._id,
      code: referral.code,
      generatedBy: referral.generatedBy,
      status: referral.status,
      policy: referral.policy,
      usedBy: referral.usedBy,
      usageCount: referral.usageCount,
      expirationDateUTC: referral.expirationDate,
      expirationDateIST: DateTime.fromISO(referral.expirationDate)
        .setZone("Asia/Kolkata")
        .toISO(),
      createdAt: referral.createdAt,
      updatedAt: referral.updatedAt,
    }));

    return res.status(200).json({ referrals: formattedReferrals });
  } catch (error) {
    next(error);
  }
};

export const generateReferralCode = async (req, res, next) => {
  try {
    const userId = req.userId;
    const now = DateTime.now().toUTC().toISO();

    const policy = await ReferralPolicy.findOne({
      isActive: true,
      expiration: { $gte: now },
    });
    if (!policy) {
      const error = new Error(
        "No active referral policy found or the policy has expired."
      );
      error.statusCode = 400;
      throw error;
    }

    const referralCode = createReferralCode();

    const expirationDate = DateTime.now()
      .plus({ days: policy.validityPeriod })
      .toUTC()
      .toISO();
    const expirationIST = DateTime.fromISO(expirationDate)
      .setZone("Asia/Kolkata")
      .toISO();

    const newReferralCode = new ReferralCode({
      code: referralCode,
      generatedBy: userId,
      policy: policy._id,
      status: "active",
      expirationDate: expirationDate,
      expirationIST: expirationIST,
    });

    await newReferralCode.save();

    return res.status(201).json({ referralCode });
  } catch (error) {
    next(error);
  }
};

export const checkReferralCode = async (req, res, next) => {
  try {
    const now = DateTime.now().toUTC().toISO();

    const policy = await ReferralPolicy.findOne({
      isActive: true,
      expiration: { $gte: now },
    });
    if (!policy) {
      const error = new Error(
        "The referral code policy is either expired or terminated."
      );
      error.statusCode = 404;
      throw error;
    }
    const referralCode = await ReferralCode.findOne({
      code: req.params.code,
      expirationDate: { $gte: now },
    });
    if (!referralCode) {
      const error = new Error("The referral code has been expired");
      error.statusCode = 404;
      throw error;
    }

    const expirationIST = DateTime.fromISO(referralCode.expirationDate)
      .setZone("Asia/Kolkata")
      .toISO();

    return res.status(201).json({
      isActive: true,
      message: "The code is active and has not expired",
      expirationDate: referralCode.expirationDate,
      expirationIST: expirationIST,
    });
  } catch (error) {
    next(error);
  }
};
