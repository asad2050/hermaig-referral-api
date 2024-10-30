import { Router } from "express";
import {
  // getAllPolicies,
  // getPolicyDetails,
  // createReferralPolicy,
  // updatePolicy,
  // getAllReferralsUnderThisPolicy,
  getAllReferrals,
  getUserReferrals,
  getReferralDetails,
} from "../controllers/admin.controller.mjs";
import {
  referralDetailsValidator,
  userIdValidator,
  // policyDetailsValidator,
  // createPolicyValidator,
  // updatePolicyValidator,
} from "../util/validation.mjs";
const router = Router();
// router.get("/policy", getAllPolicies);
// router.get("/policy/view/:pId", policyDetailsValidator, getPolicyDetails);
// router.post("/policy", createPolicyValidator, createReferralPolicy);
// router.patch("/policy/:pId", updatePolicyValidator, updatePolicy);
// router.get("/policy/:pId/referrals",policyDetailsValidator, getAllReferralsUnderThisPolicy);
router.get("/referrals", getAllReferrals);
router.get("/referrals/:rId", referralDetailsValidator, getReferralDetails);
router.get("/user/:userId/referrals", userIdValidator, getUserReferrals);
// router.get("/user/:userId/rewards", userIdValidator, getUserRewards);

export default router;
