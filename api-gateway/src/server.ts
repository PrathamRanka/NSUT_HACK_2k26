import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Scheme, Vendor, Alert, AuditLog } from './models';

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pfms_fraud_db';

// --- Seeding Logic ---
async function seedDatabase() {
    const schemeCount = await Scheme.countDocuments();
    if (schemeCount === 0) {
        console.log("🌱 Seeding Database...");
        await Scheme.insertMany([
            { id: "SCH-001", name: "PM-KISAN", ministry: "Agriculture", budgetAllocated: 60000000000, status: "ACTIVE", description: "Direct income support for farmers" },
            { id: "SCH-002", name: "MGNREGA", ministry: "Rural Development", budgetAllocated: 73000000000, status: "ACTIVE", description: "Employment guarantee scheme" },
            { id: "SCH-003", name: "PMAY-G", ministry: "Housing", budgetAllocated: 20000000000, status: "ACTIVE", description: "Rural housing scheme" }
        ]);
        await Vendor.insertMany([
            { id: "VEN-991", name: "Agro Tech Supplies", gstin: "09AAACA1234A1Z5", riskScore: 12, totalVolume: 8500000, flaggedTransactions: 0, accountStatus: "ACTIVE" },
            { id: "VEN-882", name: "Rural Infra Builders", gstin: "09BBBCB5678B1Z2", riskScore: 88, totalVolume: 12000000, flaggedTransactions: 14, accountStatus: "UNDER_WATCH" },
            { id: "VEN-773", name: "Direct Beneficiary Transfer", gstin: "NA", riskScore: 0, totalVolume: 500000000, flaggedTransactions: 2, accountStatus: "ACTIVE" }
        ]);
        console.log("✅ Database Seeded!");
    }
}

// --- Server Start ---
mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log(`Connected to MongoDB at ${MONGO_URI}`);
        await seedDatabase();

        app.listen(PORT, () => {
            console.log(`🚀 API Gateway running on port ${PORT}`);
            console.log(`📡 URL: http://localhost:${PORT}`);
        });
    })
    .catch(err => console.error("❌ MongoDB Connection Failed:", err));
