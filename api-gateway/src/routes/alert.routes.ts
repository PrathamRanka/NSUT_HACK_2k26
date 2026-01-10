import { Router } from 'express';
import { AlertController } from '../controllers/alert.controller';

const router = Router();

router.post('/', AlertController.createAlert); // Mapped to /alerts/
router.get('/stats', AlertController.getStats);
router.get('/', AlertController.getAlerts);
router.put('/:id/status', AlertController.updateAlertStatus);

export default router;
