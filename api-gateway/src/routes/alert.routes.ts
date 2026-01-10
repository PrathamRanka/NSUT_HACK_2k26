import { Router } from 'express';
import { AlertController } from '../controllers/alert.controller';

const router = Router();

router.post('/', AlertController.createAlert); // Mapped to /alerts/
router.get('/', AlertController.getAlerts);

export default router;
