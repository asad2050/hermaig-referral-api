import { Router } from "express";
import {
  generateReferralCode,
  checkReferralCode,
  viewReferral,
} from "../controllers/referral.controller.mjs";
import { getUserRewards } from "../controllers/user.controller.mjs";
import { codeValidator } from "../util/validation.mjs";

const router = Router();

router.get("/", viewReferral);
router.get("/generate", generateReferralCode);
router.get("/check/:code",codeValidator ,checkReferralCode);
router.get('/rewards', getUserRewards);

export default router;
