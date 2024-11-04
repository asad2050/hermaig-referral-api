import { Router } from 'express';
import {storeUserInteractions,storeGoogleUserInformation} from '../controllers/user.controller.mjs'; 
import { userInteractionsValidator,googleUserInfoValidator } from '../util/validation.mjs';

const router =Router();

router.post('/interactions',storeUserInteractions)
router.post('/google',googleUserInfoValidator,storeGoogleUserInformation)

export default router