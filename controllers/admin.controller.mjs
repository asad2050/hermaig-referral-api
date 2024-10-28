import ReferralPolicy from "../models/referralPolicy.model.mjs";
import ReferralCode from "../models/referral.model.mjs";
// import Reward from "../models/reward.model.mjs";
import User from "../models/user.model.mjs";
import { DateTime } from "luxon";

export const getAllPolicies = async (req, res, next) => {
  try {
    const policies = await ReferralPolicy.find();
    if (!policies) {
      const error = new Error("Could not fetch policies");
      error.statusCode = 500;
      throw error;
    }
    if (policies.length === 0) {
      return res.status(200).json({ message: "No policies found" });
    }

    res.status(200).json({ policies });
  } catch (error) {
    next(error);
  }
};

export const getPolicyDetails = async (req, res, next) => {
  const policyId = req.params.pId;

  try {
    const policy = await ReferralPolicy.findById(policyId);
    if (!policy) {
      const error = new Error("Policy not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ policy });
  } catch (error) {
    next(error);
  }
};
export const createReferralPolicy = async (req, res, next) => {
  const { rewardPoints, validityPeriod, name } = req.body;

  try {
    const newPolicy = new ReferralPolicy({
      name,
      rewardPoints,
      validityPeriod,
      expirationDate: DateTime.now()
        .plus({ days: validityPeriod })
        .toUTC()
        .toISO(),
      expirationIST: DateTime.fromISO(validityPeriod)
        .setZone("Asia/Kolkata")
        .toISO(),
    });

    const savedPolicy = await newPolicy.save();
    if (!savedPolicy) {
      const error = new Error("Could not create policy");
      error.statusCode = 500;
    }
    res.status(201).json({
      message: "Referral policy created successfully!",
      policy: savedPolicy,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePolicy = async (req, res, next) => {
  const { pId } = req.params;
  const { isActive } = req.body;

  try {
    const policy = await ReferralPolicy.findById(pId);
    if (!policy) {
      const error = new Error("Policy not found");
      error.statusCode = 404;
      throw error;
    }

    const currentDate = DateTime.now();
    const createdDate = DateTime.fromJSDate(policy.createdAt);
    const expirationDate = createdDate.plus({ days: policy.validityPeriod });

    if (currentDate >= expirationDate) {
      policy.isActive = false;
    } else if (isActive) {
      policy.isActive = isActive;
    }

    const updatedPolicy = await policy.save();
    res.status(200).json({
      message: "Referral policy updated successfully!",
      policy: updatedPolicy,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllReferralsUnderThisPolicy = async (req, res, next) => {
  const policyId = req.params.pId;

  try {
    const referrals = await ReferralCode.find({ policy: policyId }).populate(
      "generatedBy",
      "name email"
    );
    if (!referrals) {
      const error = new Error("Could not fetch referrals");
      error.statusCode = 500;
      throw error;
    }
    if (referrals.length === 0) {
      return res.status(200).json({ message: "No referrals found" });
    }

    res.status(200).json({ referrals });
  } catch (error) {
    next(error);
  }
};

export const getAllReferrals = async (req, res, next) => {
  try {
    const referrals = await ReferralCode.find().populate(
      "generatedBy",
      "name email"
    );
    if (!referrals) {
      const error = new Error("Could not fetch referrals");
      error.statusCode = 500;
      throw error;
    }
    if (referrals.length === 0) {
      return res.status(200).json({ message: "No referrals found" });
    }

    res.status(200).json({ referrals });
  } catch (error) {
    next(error);
  }
};

export const getReferralDetails = async (req, res, next) => {
  const referralId = req.params.rId;
  try {
    const referral = await ReferralCode.findById(referralId).populate(
      "generatedBy",
      "name email"
    );
    if (!referral) {
      const error = new Error("Referral not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ referral });
  } catch (error) {
    next(error);
  }
};

export const getUserReferrals = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("No user found");
      error.statusCode = 404;
      throw error;
    }
    const referrals = await ReferralCode.find({ generatedBy: userId }).populate(
      "generatedBy",
      "name email"
    );
    if (!referrals) {
      const error = new Error("Could not fetch referrals");
      error.statusCode = 500;
      throw error;
    }
    if (referrals.length === 0) {
      return res.status(200).json({ message: "No referrals found" });
    }
    res.status(200).json({ referrals });
  } catch (error) {
    next(error);
  }
};
// export const getUserRewards = async (req, res, next) => {
//   const userId = req.params.userId;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       const error = new Error("No user found");
//       error.statusCode = 404;
//       throw error;
//     }
//     const rewards = await ReferralCode.find({ generatedBy: userId }).populate(
//       "generatedBy",
//       "name email"
//     );
//     if (!rewards) {
//       const error = new Error("Could not fetch rewards");
//       error.statusCode = 500;
//       throw error;
//     }
//     if (rewards.length === 0) {
//       return res.status(200).json({ message: "No rewards found" });
//     }
//     res.status(200).json({rewards});
//   } catch (error) {
//     next(error);
//   }
// };