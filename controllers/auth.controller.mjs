import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
// import { createReferralCode } from "../util/createReferralCode.mjs";
import User from "../models/user.model.mjs";
import UserInteraction from "../models/userInteraction.model.mjs";
import ReferralCode from "../models/referral.model.mjs";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";



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
      if (!referralCode ) {
        errorData.push("Referral code is invalid.");
      }
     else if(referralCode.generatedBy){ 
        referredByUser = await User.findById(referralCode?.generatedBy);
        if (!referredByUser) {
          errorData.push("Referrer doesn't exist.");
        }

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
      // userId:newUser._id,
      interactionType: "signup",
      referralCode: referredByUser ? referredByUser.referralCode :'',
    });

    if (referralCode && referredByUser) {
      const responseUserInterationSave = await userInteraction.save();
      referralCode.usedBy.push(savedUser._id);
      // referralCode.usedBy.push(newUser._id)
      // referralCode.userInteractions.push(userInteraction._id);
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

// forgot password







// Initialize the MailerSend client with the API key
const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

export async function forgetPassword(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });

    // If user not found, send error message
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Generate a unique JWT token for the user that contains the user's id
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "10m" });

    // Configure the email parameters
    const sentFrom = new Sender(process.env.EMAIL,"Harmaig Jewellers"); // Sender's email and name
    const recipients = [new Recipient(req.body.email, user.name)]; // Recipient's email and name

    // Create email params with dynamic HTML content
    const emailParams = new EmailParams()
      .setFrom(sentFrom) // Set the sender
      .setTo(recipients) // Set the recipient
      .setReplyTo(sentFrom) // Optional: Set a reply-to email
      .setSubject("Reset Your Password") // Set the subject
      .setHtml(`<h1>Reset Your Password</h1>
                <p>Click on the following link to reset your password:</p>
                <a href="${process.env.FRONTEND_URL}/reset-password/${token}">${process.env.FRONTEND_URL}/reset-password/${token}</a>
                <p>The link will expire in 10 minutes.</p>
                <p>If you didn't request a password reset, please ignore this email.</p>`);

    // Send the email using MailerSend
    const response = await mailerSend.email.send(emailParams);
    // Check if the email was successfully sent
    if (response.statusCode===202) {
      return res.status(200).send({ message: "Email sent successfully" });
    } 
     else {
      return res.status(500).send({ message: "Failed to send email" });
    }
  } catch (err) {
    // if(err.statusCode==='422'){
    //   return res.status(500).send({ message: "Failed to send email" })
    // }
    console.log(err)
    if(err.statusCode===422){
        return res.status(500).send({ message: "Failed to send email" })
    }
    // next(err);
  }
}



export async function resetPassword(req, res, next) {

  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    // Verify the token sent by the user
    const decodedToken = jwt.verify(req.params.token, process.env.JWT_SECRET_KEY);

    // If the token is invalid, return an error
    if (!decodedToken) {
      return res.status(401).send({ message: "Invalid token" });
    }

    // Find the user with the id from the token
    const user = await User.findOne({ _id: decodedToken.userId });
    if (!user) {
      return res.status(401).send({ message: "No user found" });
    }

    // Hash the new password
    const newHashedPw = await bcrypt.hash(req.body.newPassword, 12);

    // Update user's password
    user.password = newHashedPw;
    await user.save();

    // Send success response
    res.status(200).send({ message: "Password updated" });
  } catch (err) {
    next(err);
  }
}