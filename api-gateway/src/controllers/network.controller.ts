import { Request, Response } from 'express';
import { Vendor } from '../models';

export class NetworkController {

    static async getNetwork(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Try to find if it's a Vendor
            const vendor = await Vendor.findOne({ id });
            const centerLabel = vendor ? `Vendor: ${vendor.name}` : `Entity: ${id}`;

            // Generate dynamic graph data
            // In a real system, this queries the Transaction Table
            const nodes: any[] = [
                { id: '1', position: { x: 300, y: 300 }, data: { label: centerLabel }, style: { background: '#fef2f2', border: '2px solid #ef4444', fontWeight: 'bold' } }
            ];

            const edges = [];

            // Simulate 5-8 connections
            const count = 5 + Math.floor(Math.random() * 4);
            for (let i = 0; i < count; i++) {
                const benId = `ben-${i}`;
                const isCollusion = Math.random() > 0.7; // 30% chance of collusion

                nodes.push({
                    id: benId,
                    position: {
                        x: 300 + Math.cos(2 * Math.PI * i / count) * 200,
                        y: 300 + Math.sin(2 * Math.PI * i / count) * 200
                    },
                    data: { label: isCollusion ? `⚠ Suspect-${i}` : `Ben-${i}` }
                });

                edges.push({
                    id: `e-${i}`,
                    source: '1',
                    target: benId,
                    label: `₹${Math.floor(10 + Math.random() * 50)}k`,
                    type: 'smoothstep',
                    animated: isCollusion,
                    style: isCollusion ? { stroke: '#ef4444', strokeWidth: 2 } : {}
                });
            }

            res.json({ nodes, edges });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
