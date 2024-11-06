import { Router } from 'express';
import {storeUserInteractions,
    
} from '../controllers/user.controller.mjs'; 
import { userInteractionsValidator } from '../util/validation.mjs';

const router =Router();

router.post('/interactions',userInteractionsValidator,storeUserInteractions)
// router.post('/google',googleUserInfoValidator,storeGoogleUserInformation)

export default router