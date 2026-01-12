import { Request, Response } from 'express';
import fs from 'fs';
import csv from 'csv-parser';
import { MLService } from '../services/ml.service';
import { Alert, Vendor, IAlert } from '../models';
import { v4 as uuidv4 } from 'uuid';

export class BatchController {

    static async uploadBatch(req: Request, res: Response) {
        if (!(req as any).file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const filePath = (req as any).file.path;
        const results: any[] = [];
        const alertsCreated: any[] = [];
        let processedCount = 0;
        let highRiskCount = 0;

        try {
            await new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (data) => results.push(data))
                    .on('end', resolve)
                    .on('error', reject);
            });

            // Process each row
            for (const row of results) {
                processedCount++;

                // 1. Prepare Data for ML Service
                // Expected format: amount, agency, vendor, transaction_time, payment_behavior, timing_accuracy_days
                const transactionData = {
                    amount: parseFloat(row.amount),
                    agency: row.agency,
                    vendor: row.vendor,
                    // transaction_time: row.transaction_time, // MLService update needed to support this
                    paymentBehavior: row.payment_behavior || "REGULAR",
                    daysSinceLastPayment: parseInt(row.timing_accuracy_days || "0"),
                    // total_tender_amount: parseFloat(row.total_tender_amount || "0") // Optional
                };

                // 2. Call ML Service
                let prediction;
                try {
                    prediction = await MLService.predictFraud(transactionData);
                } catch (err) {
                    console.error(`ML Prediction failed for row ${processedCount}:`, err);
                    // Fallback or skip? Let's skip creating an alert but count as processed.
                    continue;
                }

                // 3. Create Alert if Risk is High (or just create record for all?)
                // Requirement: "sync with geospatial map" -> The map shows Alerts. 
                // So we should create Alerts for significant transactions or all?
                // Let's create Alerts for anything with riskScore > 0 to populate the map, 
                // or maybe just > 10 to avoid noise. Let's stick to valid predictions.

                // Get Vendor Location
                let lat = parseFloat(row.latitude);
                let lng = parseFloat(row.longitude);

                if (isNaN(lat) || isNaN(lng)) {
                    // Try to find vendor in DB
                    const vendor = await Vendor.findOne({ name: row.vendor });
                    if (vendor && vendor.latitude && vendor.longitude) {
                        lat = vendor.latitude;
                        lng = vendor.longitude;
                    } else {
                        // Default fallback (New Delhi) or leave empty
                        lat = 28.6139;
                        lng = 77.2090;
                    }
                }

                const alertData: Partial<IAlert> = {
                    id: `BATCH-${uuidv4()}`, // Unique ID
                    transactionId: uuidv4(),
                    scheme: row.agency, // Mapping Agency to Scheme context approx
                    vendor: row.vendor,
                    amount: transactionData.amount,
                    riskScore: prediction.riskScore,
                    status: prediction.riskScore > 50 ? "New" : "Closed", // Auto-close low risk?
                    riskLevel: prediction.riskScore > 75 ? "Critical" : (prediction.riskScore > 50 ? "High" : "Low"),
                    date: new Date().toISOString().split('T')[0], // Today
                    timestamp: new Date(),
                    district: "Unknown", // Could come from CSV
                    state: "Unknown",
                    latitude: lat,
                    longitude: lng,
                    coordinates: [lat, lng],
                    mlReasons: prediction.mlReasons || [],
                    beneficiary: "Batch Upload",
                    account: "N/A",
                    hierarchy: []
                };

                // Create Alert
                const newAlert = await Alert.create(alertData);
                alertsCreated.push(newAlert);

                if (prediction.riskScore > 50) {
                    highRiskCount++;
                }
            }

            // Cleanup file
            fs.unlinkSync(filePath);

            return res.json({
                success: true,
                message: "Batch processing complete",
                stats: {
                    totalRows: results.length,
                    processed: processedCount,
                    highRisk: highRiskCount,
                    alertsCreated: alertsCreated.length
                }
            });

        } catch (error: any) {
            console.error("Batch processing error:", error);
            return res.status(500).json({ error: "Failed to process batch file", details: error.message });
        }
    }
}
