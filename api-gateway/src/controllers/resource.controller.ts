import { Request, Response } from 'express';
import { Scheme, Vendor, AuditLog } from '../models';

export class ResourceController {

    static async getSchemes(req: Request, res: Response) {
        try {
            const schemes = await Scheme.find();
            res.json(schemes);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch schemes" });
        }
    }

    static async getVendors(req: Request, res: Response) {
        try {
            const vendors = await Vendor.find();
            res.json(vendors);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch vendors" });
        }
    }

    static async getAuditLogs(req: Request, res: Response) {
        try {
            const logs = await AuditLog.find().sort({ timestamp: -1 });
            res.json(logs);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch audit logs" });
        }
    }

    static getHealth(req: Request, res: Response) {
        res.json({ status: 'ok', engine: 'v2-modular' });
    }
}
