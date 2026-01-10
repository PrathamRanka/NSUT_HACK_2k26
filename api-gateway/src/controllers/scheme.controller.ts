import { Request, Response } from 'express';
import { Scheme } from '../models';

export class SchemeController {
    static async createScheme(req: Request, res: Response) {
        try {
            const { id, name, ministry, budgetAllocated, status, description } = req.body;

            const scheme = await Scheme.create({
                id,
                name,
                ministry,
                budgetAllocated,
                status: status || 'ACTIVE',
                description
            });

            res.status(201).json(scheme);
        } catch (error: any) {
            console.error('Create scheme error:', error);
            res.status(500).json({ error: error.message || 'Failed to create scheme' });
        }
    }

    static async updateScheme(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updates = req.body;

            const scheme = await Scheme.findOneAndUpdate(
                { id },
                updates,
                { new: true, runValidators: true }
            );

            if (!scheme) {
                return res.status(404).json({ error: 'Scheme not found' });
            }

            res.json(scheme);
        } catch (error: any) {
            console.error('Update scheme error:', error);
            res.status(500).json({ error: error.message || 'Failed to update scheme' });
        }
    }

    static async deleteScheme(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const scheme = await Scheme.findOneAndDelete({ id });

            if (!scheme) {
                return res.status(404).json({ error: 'Scheme not found' });
            }

            res.json({ message: 'Scheme deleted successfully', id });
        } catch (error: any) {
            console.error('Delete scheme error:', error);
            res.status(500).json({ error: error.message || 'Failed to delete scheme' });
        }
    }
}
