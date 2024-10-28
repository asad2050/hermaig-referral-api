import { Router } from 'express';
import {getUserRewards} from '../controllers/rewards.controller.mjs'; 

const router =Router();

router.get('/rewards', getUserRewards);



export default router