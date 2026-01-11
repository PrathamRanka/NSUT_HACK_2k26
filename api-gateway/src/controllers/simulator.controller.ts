import { Request, Response } from 'express';
import { MLService } from '../services/ml.service';

export class SimulatorController {

    static async simulateFraud(req: Request, res: Response) {
        try {
            const { amount, vendor, scheme, time } = req.body;

            // Call ML Service (Stateless)
            // We use 'Unknown' for agency if not provided to simulate generic check
            const mlResult = await MLService.predictFraud({
                amount: Number(amount),
                agency: scheme || "Simulator Test Scheme",
                vendor: vendor || "Simulator Test Vendor"
            });

            // Add simulator specific logic/metadata
            // E.g. what would happen if we tweaked values

            return res.json({
                success: true,
                inputs: { amount, vendor, scheme },
                prediction: mlResult
            });

        } catch (error: any) {
            console.error('Simulation error:', error);
            res.status(500).json({ error: error.message || 'Simulation failed' });
        }
    }
}
