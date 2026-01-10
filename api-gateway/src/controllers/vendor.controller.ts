import { Request, Response } from 'express';
import { Vendor } from '../models';

export class VendorController {
    static async createVendor(req: Request, res: Response) {
        try {
            const { id, name, pan, address, riskScore, status } = req.body;

            const vendor = await Vendor.create({
                id,
                name,
                pan,
                address,
                riskScore: riskScore || 0,
                status: status || 'ACTIVE'
            });

            res.status(201).json(vendor);
        } catch (error: any) {
            console.error('Create vendor error:', error);
            res.status(500).json({ error: error.message || 'Failed to create vendor' });
        }
    }

    static async updateVendor(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updates = req.body;

            const vendor = await Vendor.findOneAndUpdate(
                { id },
                updates,
                { new: true, runValidators: true }
            );

            if (!vendor) {
                return res.status(404).json({ error: 'Vendor not found' });
            }

            res.json(vendor);
        } catch (error: any) {
            console.error('Update vendor error:', error);
            res.status(500).json({ error: error.message || 'Failed to update vendor' });
        }
    }

    static async deleteVendor(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const vendor = await Vendor.findOneAndDelete({ id });

            if (!vendor) {
                return res.status(404).json({ error: 'Vendor not found' });
            }

            res.json({ message: 'Vendor deleted successfully', id });
        } catch (error: any) {
            console.error('Delete vendor error:', error);
            res.status(500).json({ error: error.message || 'Failed to delete vendor' });
        }
    }
}
