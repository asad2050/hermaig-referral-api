import { body, check } from "express-validator";
import mongoose from "mongoose";
export const loginValidator = [
  body("email", "Invalid: should not be empty").trim().escape().not().isEmpty(),
  body("email", "Invalid email").trim().escape().isEmail(),
  body("password", "The minimum password length is 6 characters")
    .trim()
    .escape()
    .isLength({ min: 6 }),
];

export const signupValidator = [
  body("email", "Invalid: should not be empty").trim().escape().not().isEmpty(),
  body("email", "Invalid email").trim().escape().isEmail(),
  body("password", "Password should not be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("password", "The minimum password length is 6 characters")
    .trim()
    .escape()
    .isLength({ min: 6 }),
  body("name", "The name should not be empty").trim().escape().not().isEmpty(),
  body("phoneNumber", "Mobile number must be 10 digits long")
    .trim()
    .escape()
    .isLength({ min: 10, max: 10 }),
  body("phoneNumber", "Mobile number must not be empty")
    .trim()
    .escape()
    .not()
    .isEmpty(),
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
