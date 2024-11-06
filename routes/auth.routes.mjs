import express from "express";

import { signupUser, loginUser,forgetPassword,resetPassword } from "../controllers/auth.controller.mjs";
import { signupValidator, loginValidator ,forgetPasswordValidator, resetPasswordValidator}from"../util/validation.mjs";
// import passport from 'passport';
// import { googleAuth, googleAuthCallback } from '../controllers/auth.controller.mjs';
import '../util/passport.mjs'; 
const router = express.Router();

router.post("/signup", signupValidator, signupUser);

router.post("/login", loginValidator, loginUser);

router.post('/forgot-password',forgetPasswordValidator,forgetPassword)
router.post('/reset-password/:token',resetPasswordValidator,resetPassword)

// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// router.get('/google/callback', passport.authenticate('google', { session: false }), googleAuthCallback);

// response token => authorization : Bearer +" "+ token




export default router;
