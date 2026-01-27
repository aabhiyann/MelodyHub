import { Router } from 'express';
import { GamificationController } from '../controllers/gamification.controller.js';
import { requireAuth } from '@clerk/express'; // updated import

const router = Router();

router.get('/stats', requireAuth(), GamificationController.getStats);
router.post('/xp', requireAuth(), GamificationController.awardXP);

export default router;
