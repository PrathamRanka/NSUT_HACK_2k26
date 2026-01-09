import mongoose from 'mongoose';

const SchemeSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: String,
    ministry: String,
    budgetAllocated: Number,
    status: String, // 'PILOT' | 'ACTIVE' | 'PAUSED' | 'SUNSET'
    description: String
});

const VendorSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: String,
    gstin: String,
    riskScore: Number,
    totalVolume: Number,
    flaggedTransactions: Number,
    accountStatus: String // 'ACTIVE' | 'FROZEN' | 'UNDER_WATCH'
});

const AlertSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    scheme: String,
    riskScore: Number,
    amount: Number,
    status: String,
    riskLevel: String,
    date: String,
    // Detailed fields
    beneficiary: String,
    account: String,
    district: String,
    timestamp: String,
    state: String,
    mlReasons: [String],
    hierarchy: [{ role: String, name: String, status: String, time: String }]
});

const AuditLogSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    action: String,
    actor: String,
    target: String,
    timestamp: { type: Date, default: Date.now },
    details: String
});

export const Scheme = mongoose.model('Scheme', SchemeSchema);
export const Vendor = mongoose.model('Vendor', VendorSchema);
export const Alert = mongoose.model('Alert', AlertSchema);
export const AuditLog = mongoose.model('AuditLog', AuditLogSchema);
