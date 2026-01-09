import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'api-gateway',
        timestamp: new Date().toISOString()
    });
});

// Mock Data Store (In-memory for prototype)
const alerts = [
    { id: "ALT-2026-908", scheme: "PM-KISAN", riskScore: 92, amount: 1250000, status: "Investigating", riskLevel: "Critical", date: "2026-01-09" },
    { id: "ALT-2026-882", scheme: "MGNREGA", riskScore: 78, amount: 45000, status: "New", riskLevel: "High", date: "2026-01-09" },
];

const schemes: any[] = [
    { id: "SCH-001", name: "PM-KISAN", ministry: "Agriculture", budgetAllocated: 60000000000, status: "ACTIVE", description: "Direct income support for farmers" },
    { id: "SCH-002", name: "MGNREGA", ministry: "Rural Development", budgetAllocated: 73000000000, status: "ACTIVE", description: "Employment guarantee scheme" },
    { id: "SCH-003", name: "PMAY-G", ministry: "Housing", budgetAllocated: 20000000000, status: "ACTIVE", description: "Rural housing scheme" }
];

const vendors = [
    { id: "VEN-991", name: "Agro Tech Supplies", gstin: "09AAACA1234A1Z5", riskScore: 12, totalVolume: 8500000, flaggedTransactions: 0, accountStatus: "ACTIVE" },
    { id: "VEN-882", name: "Rural Infra Builders", gstin: "09BBBCB5678B1Z2", riskScore: 88, totalVolume: 12000000, flaggedTransactions: 14, accountStatus: "UNDER_WATCH" },
    { id: "VEN-773", name: "Direct Beneficiary Transfer", gstin: "NA", riskScore: 0, totalVolume: 500000000, flaggedTransactions: 2, accountStatus: "ACTIVE" }
];

const auditLogs = [
    { id: "LOG-9002", action: "ALERT_VIEWED", actor: "Officer Singh", target: "ALT-2026-908", timestamp: "2026-01-09T10:45:00", details: "Viewed alert details" },
    { id: "LOG-9001", action: "LOGIN", actor: "Officer Singh", target: "System", timestamp: "2026-01-09T10:00:00", details: "Successful login from IP 10.2.1.4" },
    { id: "LOG-8999", action: "SCHEME_UPDATE", actor: "Admin User", target: "SCH-001", timestamp: "2026-01-08T18:30:00", details: "Updated budget allocation" }
];

// Scheme Routes
app.get('/schemes', (req, res) => res.json(schemes));
app.post('/schemes', (req, res) => {
    // Mock Create
    const newScheme = { id: `SCH-${Date.now()}`, ...req.body, status: 'PILOT' };
    schemes.push(newScheme);
    res.json(newScheme);
});

// Vendor Routes
app.get('/vendors', (req, res) => res.json(vendors));
app.get('/vendors/:id', (req, res) => {
    const vendor = vendors.find(v => v.id === req.params.id);
    if (vendor) res.json(vendor); else res.sendStatus(404);
});

app.get('/audit-logs', (req, res) => res.json(auditLogs));

app.get('/alerts', (req, res) => {
    // In real app, filter by role/region
    res.json(alerts);
});

app.get('/alerts/:id', (req, res) => {
    const alert = alerts.find(a => a.id === req.params.id);
    if (alert) {
        res.json({
            ...alert,
            beneficiary: "Ramesh Kumar (ID: BEN-8821)",
            account: "XXXX-XXXX-9021",
            district: "Sitapur, UP",
            timestamp: "2026-01-09T10:42:00",
            state: "PARTIALLY_RELEASED",
            mlReasons: [
                "Beneficiary DOB matches deceased registry (Confidence: 98%)",
                "Cluster of 40 payments to same geo-hash in 10 mins",
                "First-time large disbursement > 3 std dev from mean"
            ],
            hierarchy: [
                { role: "Initiator", name: "Panchayat Sec. Verma", status: "Approved", time: "10:15 AM" },
                { role: "Recommender", name: "BDO Officer Singh", status: "Approved", time: "10:30 AM" },
                { role: "Approver", name: "DDO District Office", status: "Pending", time: "-" }
            ]
        });
    } else {
        res.status(404).json({ message: "Alert not found" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
