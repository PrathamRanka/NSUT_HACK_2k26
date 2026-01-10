import { Router } from 'express';
import { SummaryController } from '../controllers/summary.controller';

const router = Router();

// Get all flagged transactions
router.get('/flagged', SummaryController.getFlaggedTransactions);

// Generate AI profile for specific alert
router.post('/generate/:alertId', SummaryController.generateProfile);

export default router;
