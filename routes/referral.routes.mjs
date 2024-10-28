import { Router } from "express";
import {
  generateReferralCode,
  checkReferralCode,
  viewAllReferrals,
} from "../controllers/referral.controller.mjs";
import { codeValidator } from "../util/validation.mjs";

const router = Router();

router.get("/", viewAllReferrals);
router.get("/generate", generateReferralCode);
router.get("/check/:code",codeValidator ,checkReferralCode);

export default router;
