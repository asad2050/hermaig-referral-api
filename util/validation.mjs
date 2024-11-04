import { body, check } from "express-validator";
import mongoose from "mongoose";
export const loginValidator = [
  body("email", "Invalid: should not be empty").trim().escape().not().isEmpty(),
  body("email", "Invalid email").isEmail(),
  // body("password", "The minimum password length is 6 characters")
  //   .trim()
  //   .escape()
  //   .isLength({ min: 6 }),
];

export const signupValidator = [
  body("email", "Invalid: should not be empty").trim().escape().not().isEmpty(),
  body("email", "Invalid email").isEmail(),
  // body("password", "Password should not be empty")
  //   .trim()
  //   .escape()
  //   .not()
  //   .isEmpty(),
  // body("password", "The minimum password length is 6 characters")
  //   .trim()
  //   .escape()
  //   .isLength({ min: 6 }),
  body("password", "The minimum password length is 6 characters").custom((value) => {
    return value.trim().length >= 6;
  }),
  body("name", "The name should not be empty").trim().escape().not().isEmpty(),
  body('phoneNumber', "Mobile number is invalid").custom((value)=>{
    if(value.trim().length === 0){
      return true
  } if(value.trim().length === 10){
    return true
  }
  return false
  }),
  body('referralCode', "Referral code is invalid").trim().escape(),
  body('role', "Role is invalid").trim().escape().isIn(['user', 'influencer']),
];

export const createPolicyValidator = [
  body("name", "The name should not be empty").trim().escape().not().isEmpty(),
  body("rewardPoints", "The reward points can only be a number").isNumeric(),
  body("validityPeriod", "The validity period can only be a number").isNumeric(),
];
export const updatePolicyValidator = [
  body("isActive", "The isActive can only be a boolean").isBoolean(),
  check("pId", "Invalid object Id pId").custom((value) => {
    return mongoose.isValidObjectId(value);
  }),
];

export const codeValidator = [
  check("code", "The code cannot be empty").trim().escape().not().isEmpty(),
];

export const userInteractionsValidator = [
  body("interactionType", "The interaction type cannot be empty").trim().escape().not().isEmpty(),
  body("interactionType", "The interaction type should be either 'signup' or 'login'").trim().escape().isIn(["signup", 'linkClick',"pageVisit"]),
  body("interactionDetails", "The interaction details cannot be empty").isArray(),
  body("interactionDetails.*.url", "The url cannot be empty").trim().escape().not().isEmpty(),
  body("interactionDetails.*.timestamp", "The timestamp cannot be empty").trim().escape().not().isEmpty(),  
]
export const policyDetailsValidator = [
  check("pId", "Invalid object Id pId").custom((value) => {
    return mongoose.isValidObjectId(value);
  }),
];

export const referralDetailsValidator = [
  check("rId", "Invalid object Id rId").custom((value) => {
    return mongoose.isValidObjectId(value);
  }),
];

export const userIdValidator = [
  check("userId", "Invalid object Id userId").custom((value) => {
    return mongoose.isValidObjectId(value);
  }),
];

export const googleUserInfoValidator= [
  body('role', "Role is invalid").trim().escape(),
  body('referredByCode', "Name is invalid").trim().escape(),
]
