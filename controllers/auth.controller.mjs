import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
// import { createReferralCode } from "../util/createReferralCode.mjs";
import User from "../models/user.model.mjs";
import UserInteraction from "../models/userInteraction.model.mjs";
import ReferralCode from "../models/referral.model.mjs";

export async function signupUser(req, res, next) {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const errorData = [];
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

    const emailAlreadyExists = await User.findOne({
      email: req.body.email,
    });
    const phoneNumberAlreadyExists= await User.findOne({
phoneNumber:req.body.phoneNumber    });
    if (emailAlreadyExists ) {
      const error = new Error(
        "A user with this email already exists."
      );
      error.statusCode = 403;
      throw error;
    }   
    if (phoneNumberAlreadyExists) {
      const error = new Error(
        "A user with this phone number already exists."
      );
      error.statusCode = 403;
      throw error;
    }

    const hashedPw = await bcrypt.hash(req.body.password, 12);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      role: req.body.role,
      password: hashedPw,
      referredBy: referredByUser ? referredByUser.referralCode : '',
      rewardPoints: 0,
    });
    // console.log(newUser)
    const savedUser = await newUser.save();

    // console.log(referralCode)
    // console.log(referredByUser)

    const userInteraction = new UserInteraction({
      userId: savedUser._id,
      interactionType: "signup",
      referralCode: referredByUser ? referredByUser.referralCode :'',
    });

    if (referralCode) {
      const responseUserInterationSave = await userInteraction.save();
      referralCode.usedBy.push(savedUser._id);
      referralCode.userInteractions.push(responseUserInterationSave._id);
      referralCode.usageCount += 1;
      await referralCode.save();
      referredByUser.rewardPoints += 10;
      await referredByUser.save();
    }
    // console.log(savedUser)
    // console.log(userInteraction)
    // console.log(referralCode)
    // console.log(referredByUser)
    const responseError = errorData ?? errorData.length > 0 ? errorData : null;
    res
      .status(201)
      .json({ message: "User created!", userId: savedUser._id, responseError });
    // res.status(201).json({
    //   message:"Success"
    // })
  } catch (err) {
    next(err);
  }
}

export async function loginUser(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const email = req.body.email;
    const password = req.body.password;

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
        role: existingUser.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "3h" }
    );

    res.status(200).json({
      token: token,
      userId: existingUser._id.toString(),
      role: existingUser.role,
      isAdmin: existingUser.isAdmin,
      expiresIn: 3600 * 3,
    });
  } catch (err) {
    next(err);
  }
}

// export const googleAuth = (req, res) => {
//   res.redirect("/");
// };

// export const googleAuthCallback = (req, res) => {
//   // User will be redirected here after successful authentication
//   const { token, user, expiresIn } = req.user;
//   // console.log(req)

//   // res.json({ token, user });
//   res.redirect(
//     `${process.env.FRONTEND_URL}/google/callback?token=${token}&userId=${user._id}&role=${user.role}&isAdmin=${user.isAdmin}&expiresIn=${expiresIn}`
//   );
// };
