import { Router } from 'express';
import { ResourceController } from '../controllers/resource.controller';

const router = Router();

router.get('/schemes', ResourceController.getSchemes);
router.get('/vendors', ResourceController.getVendors);
router.get('/audit-logs', ResourceController.getAuditLogs);
router.get('/health', ResourceController.getHealth);

export default router;
