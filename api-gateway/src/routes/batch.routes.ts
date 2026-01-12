import express from 'express';
import multer from 'multer';
import { BatchController } from '../controllers/batch.controller';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// POST /api/batch/upload
router.post('/upload', upload.single('file'), BatchController.uploadBatch);

export default router;
