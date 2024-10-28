import express from "express";
import { signupUser, loginUser } from "../controllers/auth.controller.mjs";
import { signupValidator, loginValidator }from"../util/validation.mjs";

const router = express.Router();

router.post("/signup", signupValidator, signupUser);

router.post("/login", loginValidator, loginUser);

export default router;
