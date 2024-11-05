import ReferralCode from "../models/referral.model.mjs";
// import ReferralPolicy from "../models/referralPolicy.model.mjs";
import UserInteraction from "../models/userInteraction.model.mjs";
import User from "../models/user.model.mjs";
import { createReferralCode } from "../util/createReferralCode.mjs";
import { DateTime } from "luxon";
import redisClient from '../util/redisClient.mjs'
// no pagination
// export const viewReferral = async (req, res, next) => {
//   try {

//     const referral = await ReferralCode.findOne({
//       generatedBy: req.userId,
//     }).populate("generatedBy", "name email");

//     if (!referral) {
//       const error = new Error("No referrals found");
//       error.statusCode = 404;
//       throw error;
//     }
//     const userInteractions = await userInteraction
//       .find({ _id: referral.userInteractions })
//       .populate("userId", "name email");

    

//     const formattedReferral = {
//       _id: referral._id,
//       code: referral.code,
//       generatedBy: referral.generatedBy,
//       status: referral.status,
//       userInterations: userInteractions,
//       // policy: referral.policy,
//       usedBy: referral.usedBy,
//       usageCount: referral.usageCount,
//       // expirationDateUTC: referral.expirationDate,
//       // expirationDateIST: DateTime.fromISO(referral.expirationDate)
//       //   .setZone("Asia/Kolkata")
//       //   .toISO(),
//       createdAt: referral.createdAt,
//       updatedAt: referral.updatedAt,
//     };

//     return res.status(200).json({ referral: formattedReferral });
//   } catch (error) {
//     next(error);
//   }
// };
// pagination
// export const viewReferral = async (req, res, next) => {

//   const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
//   const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not specified

//   try {
//     const referral = await ReferralCode.findOne({generatedBy:req.userId}).populate(
//       "generatedBy",
//       "name email"
//     );

//     if (!referral) {
//       const error = new Error("Referral not found");
//       error.statusCode = 404;
//       throw error;
//     }

//     // Pagination for user interactions
//     const totalInteractions = await UserInteraction.countDocuments({ _id: { $in: referral.userInteractions } });
//     const userInteractions = await UserInteraction.find({ _id: { $in: referral.userInteractions } })
//       .populate('userId', 'name email')
//       .skip((page - 1) * limit)
//       .limit(limit);

//     const formattedReferral = {
//       _id: referral._id,
//       code: referral.code,
//       generatedBy: referral.generatedBy,
//       usedBy: referral.usedBy,
//       status: referral.status,
//       totalInteractions:totalInteractions,
//       userInteractions: userInteractions,
//       usageCount: referral.usageCount,
//       createdAt: referral.createdAt,
//       updatedAt: referral.updatedAt,
//     };

//     res.status(200).json({
//       referral: formattedReferral,
//       pagination: {
//         totalItems: totalInteractions,
//         totalPages: Math.ceil(totalInteractions / limit),
//         currentPage: page,
//         pageSize: limit,
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// redis

export const viewReferral = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not specified
  const cacheKey = `referral:${req.userId}`; // Unique cache key based on userId

  try {
    // Check Redis cache for the referral data
    const cachedReferral = await redisClient.get(cacheKey);
    
    if (cachedReferral) {
      // If found in cache, parse and send the response
      const parsedReferral = await JSON.parse(cachedReferral);
      return res.status(200).json(parsedReferral);
    }

    const referral = await ReferralCode.findOne({ generatedBy: req.userId }).populate(
      "generatedBy",
      "name email"
    );

    if (!referral) {
      const error = new Error("Referral not found");
      error.statusCode = 404;
      throw error;
    }

    // Pagination for user interactions
    const totalInteractions = await UserInteraction.countDocuments({ _id: { $in: referral.userInteractions } });
    const userInteractions = await UserInteraction.find({ _id: { $in: referral.userInteractions } })
      .populate('userId', 'name email')
      .skip((page - 1) * limit)
      .limit(limit);

    const formattedReferral = {
      _id: referral._id,
      code: referral.code,
      generatedBy: referral.generatedBy,
      usedBy: referral.usedBy,
      status: referral.status,
      totalInteractions: totalInteractions,
      userInteractions: userInteractions,
      usageCount: referral.usageCount,
      createdAt: referral.createdAt,
      updatedAt: referral.updatedAt,
    };

    // Cache the referral data in Redis with an expiration time (e.g., 1 hour)
    await redisClient.set(cacheKey, JSON.stringify({
      referral: formattedReferral,
      pagination: {
        totalItems: totalInteractions,
        totalPages: Math.ceil(totalInteractions / limit),
        currentPage: page,
        pageSize: limit,
      }
    }), 'EX', 3600); // 'EX' sets the expiration time in seconds

    res.status(200).json({
      referral: formattedReferral,
      pagination: {
        totalItems: totalInteractions,
        totalPages: Math.ceil(totalInteractions / limit),
        currentPage: page,
        pageSize: limit,
      }
    });
  } catch (error) {
    next(error);
  }
};

export const generateReferralCode = async (req, res, next) => {
  try {
    const userId = req.userId;
    // const now = DateTime.now().toUTC().toISO();
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
    // let finalReferral;
    const existingReferral = await ReferralCode.findOne({
      generatedBy: userId,
    });
    if (existingReferral) {
      //   existingReferral.code = referralCode;
      // finalReferral=  await existingReferral.save();
      // console.log(existingReferral);
      return res
        .status(201)
        .json({
          message: "Referral code already generated",
          referralCode: existingReferral.code,
        });
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
    await user.save();

    return res.status(201).json({ referralCode });
  } catch (error) {
    next(error);
  }
};

// before
// export const checkReferralCode = async (req, res, next) => {
//   try {
//     const now = DateTime.now().toUTC().toISO();

//     // const policy = await ReferralPolicy.findOne({
//     //   isActive: true,
//     //   expiration: { $gte: now },
//     // });
//     // if (!policy) {
//     //   const error = new Error(
//     //     "The referral code policy is either expired or terminated."
//     //   );
//     //   error.statusCode = 404;
//     //   throw error;
//     // }
//     const referralCode = await ReferralCode.findOne({
//       code: req.params.code,
//     });
//     if (!referralCode) {
//       const error = new Error("The referral code has been expired");
//       error.statusCode = 404;
//       throw error;
//     }

//     // const expirationIST = DateTime.fromISO(referralCode.expirationDate)
//     //   .setZone("Asia/Kolkata")
//     //   .toISO();

//     return res.status(201).json({
//       isActive: true,
//       message: "The code is active and has not expired",
//       // expirationDate: referralCode.expirationDate,
//       // expirationIST: expirationIST,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// redis

export const checkReferralCode = async (req, res, next) => {
  try {
    const code = req.params.code;

    // Check Redis cache for the referral code
    const cachedReferralCode = await redisClient.get(`referralCode:${code}`);
    if (cachedReferralCode) {
      return res.status(200).json({
        isActive: true,
        message: "The code is active and has not expired",
      });
    }

    const referralCode = await ReferralCode.findOne({
      code: code,
    });

    if (!referralCode) {
      const error = new Error("The referral code has expired");
      error.statusCode = 404;
      throw error;
    }

    // Optionally cache the valid referral code in Redis (if it is not expired)
    // You might want to set a suitable expiration for the cache
    await redisClient.set(`referralCode:${code}`, JSON.stringify(referralCode), 'EX', 3600); // Cache it for 1 hour

    return res.status(200).json({
      isActive: true,
      message: "The code is active and has not expired",
      // Uncomment the lines below if you have expirationDate to return
      // expirationDate: referralCode.expirationDate,
      // expirationIST: expirationIST,
    });
  } catch (error) {
    next(error);
  }
};
