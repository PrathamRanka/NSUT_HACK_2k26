import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import alertRoutes from './routes/alert.routes';
import networkRoutes from './routes/network.routes';
import { Scheme, Vendor, AuditLog } from './models'; // Keep legacy simple routes for now

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/alerts', alertRoutes);
app.use('/network', networkRoutes);

// --- LEGACY/SIMPLE ROUTES (Kept for compatibility) ---
// Ideally these would be refactored into controllers too
app.get('/schemes', async (req, res) => {
    const schemes = await Scheme.find();
    res.json(schemes);
});
app.get('/vendors', async (req, res) => {
    const vendors = await Vendor.find();
    res.json(vendors);
});
app.get('/audit-logs', async (req, res) => {
    const logs = await AuditLog.find().sort({ timestamp: -1 });
    res.json(logs);
});
app.get('/health', (req, res) => res.json({ status: 'ok', engine: 'v2-modular' }));

export default app;
