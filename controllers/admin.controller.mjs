import ReferralPolicy from "../models/referralPolicy.model.mjs";
import ReferralCode from "../models/referral.model.mjs";
import UserInteraction from "../models/userInteraction.model.mjs";
import User from "../models/user.model.mjs";
import { DateTime } from "luxon";
import redisClient from '../util/redisClient.mjs'

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
//non pagination
// export const getAllReferrals = async (req, res, next) => {
//   try {
//     const referrals = await ReferralCode.find().populate("generatedBy", "name email");
//     if (!referrals) {
//       const error = new Error("Could not fetch referrals");
//       error.statusCode = 500;
//       throw error;
//     }
//     if (referrals.length === 0) {
//       return res.status(200).json({ message: "No referrals found" });
//     }
//     const formattedReferrals = referrals.map((referral) => ({
//       _id: referral._id,
//       code: referral.code,
//       generatedBy: referral.generatedBy,
//       status: referral.status,
//       userInterations: referral.userInteractions,
//       totalUserInteractions: referral.userInteractions.length,
//       // policy: referral.policy,
//       usedBy: referral.usedBy,
//       usageCount: referral.usageCount,
//       // expirationDateUTC: referral.expirationDate,
//       // expirationDateIST: DateTime.fromISO(referral.expirationDate)
//       //   .setZone("Asia/Kolkata")
//       //   .toISO(),
//       createdAt: referral.createdAt,
//       updatedAt: referral.updatedAt,
//     }));


//     res.status(200).json({ referrals:formattedReferrals });
//   } catch (error) {
//     next(error);
//   }
// };


// non pagination
// export const getReferralDetails = async (req, res, next) => {
//   const referralId = req.params.rId;
//   try {
//     const referral = await ReferralCode.findById(referralId).populate(
//       "generatedBy",
//       "name email",
      
//     );

//     const userInteractions= await UserInteraction.find({ _id:referral.userInteractions}).populate('userId', 'name email');
//     const formattedReferral ={
//       _id: referral._id,
//       code: referral.code,
//       generatedBy: referral.generatedBy,
//       usedBy:referral.usedBy,
//       status: referral.status,
//       userInterations: userInteractions,
//       usageCount: referral.usageCount,
//       createdAt: referral.createdAt,
//       updatedAt: referral.updatedAt,
//     };
//     if (!referral) {
//       const error = new Error("Referral not found");
//       error.statusCode = 404;
//       throw error;
//     }

//     res.status(200).json({ referral: formattedReferral });
//   } catch (error) {
//     next(error);
//   }
// };



// pagination
// export const getReferralDetails = async (req, res, next) => {
//   const referralId = req.params.rId;
//   const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
//   const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not specified

//   try {
//     const referral = await ReferralCode.findById(referralId).populate(
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

// Redis
export const getReferralDetails = async (req, res, next) => {
  const referralId = req.params.rId;
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not specified

  try {
    // Check Redis cache for referral details
    const cachedReferral = await redisClient.get(`referral:${referralId}`);
    if (cachedReferral) {
      return res.status(200).json(JSON.parse(cachedReferral)); // Return cached response
    }

    const referral = await ReferralCode.findById(referralId).populate(
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

    const response = {
      referral: formattedReferral,
      pagination: {
        totalItems: totalInteractions,
        totalPages: Math.ceil(totalInteractions / limit),
        currentPage: page,
        pageSize: limit,
      }
    };

    // Cache the referral details in Redis for future requests
    await redisClient.set(`referral:${referralId}`, JSON.stringify(response), 'EX', 3600); // Cache for 1 hour

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};


// export const getUserReferrals = async (req, res, next) => {
//   const userId = req.params.userId;
//   console.log(userId);
//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       const error = new Error("No user found");
//       error.statusCode = 404;
//       throw error;
//     }
//     const referral = await ReferralCode.findOne({ generatedBy: userId,code:user.referralCode }).populate(
//       "generatedBy",
//       "name email"
//     );
  
//     const userInteractions= await UserInteraction.find({ _id:referral.userInteractions}).populate('userId', 'name email');
//     if (!referral) {
//       const error = new Error("Could not fetch referrals");
//       error.statusCode = 500;
//       throw error;
//     }
//     const formattedReferral ={
//       _id: referral._id,
//       code: referral.code,
//       generatedBy: referral.generatedBy,
//       usedBy:referral.usedBy,
//       status: referral.status,
//       userInterations: userInteractions,
//       usageCount: referral.usageCount,
//       createdAt: referral.createdAt,
//       updatedAt: referral.updatedAt,
//     };
  
//     res.status(200).json({referral:formattedReferral  });
//   } catch (error) {
//     next(error);
//   }
// };

// with pagination
// export const getAllReferrals = async (req, res, next) => {
//   const page = parseInt(req.query.page) || 1; // Default to page 1
//   const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
//   const skip = (page - 1) * limit; // Calculate how many referrals to skip

//   try {
//     const totalReferrals = await ReferralCode.countDocuments(); // Get total count of referrals
//     const referrals = await ReferralCode.find()
//       .skip(skip) // Skip the calculated number of documents
//       .limit(limit) // Limit the results to the specified number
//       .populate("generatedBy", "name email");

//     if (!referrals) {
//       return res.status(500).json({ message: "Could not fetch referrals" });
//     }

//     if (referrals.length === 0) {
//       return res.status(200).json({ message: "No referrals found" });
//     }

//     const formattedReferrals = referrals.map((referral) => ({
//       _id: referral._id,
//       code: referral.code,
//       generatedBy: referral.generatedBy,
//       status: referral.status,
//       userInterations: referral.userInteractions,
//       totalUserInteractions: referral.userInteractions.length,
//       usedBy: referral.usedBy,
//       usageCount: referral.usageCount,
//       createdAt: referral.createdAt,
//       updatedAt: referral.updatedAt,
//     }));

//     res.status(200).json({
//       referrals: formattedReferrals,
//       totalReferrals, // Include total referrals count for pagination
//       totalPages: Math.ceil(totalReferrals / limit), // Calculate total pages
//       currentPage: page, // Current page number
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// redis
export const getAllReferrals = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const skip = (page - 1) * limit; // Calculate how many referrals to skip

  try {
    // Check Redis cache for referrals
    const cachedReferrals = await redisClient.get(`referrals:page:${page}:limit:${limit}`);
    if (cachedReferrals) {
      return res.status(200).json(JSON.parse(cachedReferrals)); // Return cached response
    }

    const totalReferrals = await ReferralCode.countDocuments(); // Get total count of referrals
    const referrals = await ReferralCode.find()
      .skip(skip) // Skip the calculated number of documents
      .limit(limit) // Limit the results to the specified number
      .populate("generatedBy", "name email");

    if (!referrals) {
      return res.status(500).json({ message: "Could not fetch referrals" });
    }

    if (referrals.length === 0) {
      return res.status(200).json({ message: "No referrals found" });
    }

    const formattedReferrals = referrals.map((referral) => ({
      _id: referral._id,
      code: referral.code,
      generatedBy: referral.generatedBy,
      status: referral.status,
      userInteractions: referral.userInteractions,
      totalUserInteractions: referral.userInteractions.length,
      usedBy: referral.usedBy,
      usageCount: referral.usageCount,
      createdAt: referral.createdAt,
      updatedAt: referral.updatedAt,
    }));

    const response = {
      referrals: formattedReferrals,
      totalReferrals, // Include total referrals count for pagination
      totalPages: Math.ceil(totalReferrals / limit), // Calculate total pages
      currentPage: page, // Current page number
    };

    // Cache the response in Redis for future requests
    await redisClient.set(`referrals:page:${page}:limit:${limit}`, JSON.stringify(response), 'EX', 3600); // Cache for 1 hour

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};



//with dummy data to test the pagination buttons and behaviour
// export const getAllReferrals = async (req, res, next) => {
//   const page = parseInt(req.query.page) || 1; // Default to page 1
//   const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
//   const skip = (page - 1) * limit; // Calculate how many referrals to skip

//   // Dummy data for testing
//   const dummyReferrals = Array.from({ length: 50 }, (_, index) => ({
//     _id: `referral-${index + 1}`,
//     code: `CODE${index + 1}`,
//     generatedBy: { name: `User ${index + 1}`, email: `user${index + 1}@example.com` },
//     status: index % 2 === 0 ? "active" : "inactive",
//     userInteractions: Array.from({ length: Math.floor(Math.random() * 10) }, (_, i) => `interaction-${i + 1}`),
//     usedBy: `user-${Math.floor(Math.random() * 20)}`,
//     usageCount: Math.floor(Math.random() * 100),
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   }));

//   try {
//     const totalReferrals = dummyReferrals.length; // Total count of referrals (dummy data)
//     const referrals = dummyReferrals.slice(skip, skip + limit); // Get the current page referrals

//     if (referrals.length === 0) {
//       return res.status(200).json({ message: "No referrals found" });
//     }

//     const formattedReferrals = referrals.map((referral) => ({
//       _id: referral._id,
//       code: referral.code,
//       generatedBy: referral.generatedBy,
//       status: referral.status,
//       userInterations: referral.userInteractions,
//       totalUserInteractions: referral.userInteractions.length,
//       usedBy: referral.usedBy,
//       usageCount: referral.usageCount,
//       createdAt: referral.createdAt,
//       updatedAt: referral.updatedAt,
//     }));

//     res.status(200).json({
//       referrals: formattedReferrals,
//       totalReferrals, // Include total referrals count for pagination
//       totalPages: Math.ceil(totalReferrals / limit), // Calculate total pages
//       currentPage: page, // Current page number
//     });
//   } catch (error) {
//     next(error);
//   }
// };

























