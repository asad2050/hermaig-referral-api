import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { createReferralCode } from "../util/createReferralCode.mjs";
import User from "../models/user.model.mjs";
import ReferralCode from "../models/referral.model.mjs";

// export async function signupUser(req, res, next) {
//   const errors = validationResult(req);
//   try {
//     if (!errors.isEmpty()) {
//       const error = new Error("Validation failed.");
//       error.statusCode = 422;
//       error.data = errors.array();
//       throw error;
//     }

//     let referredByUser = null;
//     if (req.body.referredByCode) {
//       referredByUser = await User.findOne({
//         referralCode: req.body.referredByCode,
//       });
//       if (!referredByUser) {
//         const error = new Error("Referral code is invalid.");
//         error.statusCode = 400;
//         throw error;
//       }
//     }

//     const userAlreadyExists = await User.findOne({ email: req.body.email });
//     if (userAlreadyExists) {
//       const error = new Error("A user with this email already exists.");
//       error.statusCode = 403;
//       throw error;
//     }

//     const hashedPw = await bcrypt.hash(req.body.password, 12);
//     const newUser = new User({
//       name: req.body.name,
//       email: req.body.email,
//       phoneNumber: req.body.phoneNumber,
//       password: hashedPw,
//       referralCode: createReferralCode(),
//       referredBy: referredByUser ? referredByUser.referralCode : null,
//       rewardPoints: 0,
//     });

//     const savedUser = await newUser.save();

//     if (referredByUser) {
//       referralCode.usedBy.push(savedUser._id);
//       referredByUser.rewardPoints += 10;
//       await referredByUser.save();
//     }

//     res.status(201).json({ message: "User created!", userId: savedUser._id });
//   } catch (err) {
//     next(err);
//   }
// }

export async function signupUser(req, res, next) {
  const errors = validationResult(req);
  
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const errorData=[];
    let referredByUser = null;
    let referralCode = null;
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
  
    const userAlreadyExists = await User.findOne({ email: req.body.email });
    if (userAlreadyExists) {
      const error = new Error("A user with this email already exists.");
      error.statusCode = 403;
      throw error;
    }

    const hashedPw = await bcrypt.hash(req.body.password, 12);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: hashedPw,
      referredBy: referredByUser ? referredByUser.referralCode : null,
      rewardPoints: 0,
    });


    const savedUser = await newUser.save();
    console.log(referralCode)

    if (referralCode) {
      referralCode.usedBy.push(savedUser._id);
      referralCode.usageCount += 1;
      await referralCode.save();
      referredByUser.rewardPoints += 10;
      await referredByUser.save();
    }
    const responseError = errorData ?? errorData.length > 0 ? errorData : null;
    res.status(201).json({ message: "User created!", userId: savedUser._id , responseError });
  } catch (err) {
    next(err);
  }
}

export async function loginUser(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const password = req.body.password;

  try {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      throw error;
    }

    const isPasswordEqual = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordEqual) {
      const error = new Error("Incorrect password!");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: existingUser.email,
        userId: existingUser._id.toString(),
        isAdmin: existingUser.isAdmin,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "3h" }
    );

    res.status(200).json({
      token: token,
      userId: existingUser._id.toString(),
      isAdmin: existingUser.isAdmin,
      expiresIn: 3600 * 3,
    });
  } catch (err) {
    next(err);
  }
}
