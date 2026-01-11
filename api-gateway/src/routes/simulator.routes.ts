import { Router } from 'express';
import { SimulatorController } from '../controllers/simulator.controller';

const router = Router();

router.post('/predict', SimulatorController.simulateFraud);

export default router;
