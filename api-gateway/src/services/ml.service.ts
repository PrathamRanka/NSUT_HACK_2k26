import axios from 'axios';

export class MLService {
    private static ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

    static async predictFraud(data: { amount: number; agency: string; vendor: string }) {
        try {
            console.log(`[ML Service] Sending request to ${this.ML_URL}/predict`, data);
            const response = await axios.post(`${this.ML_URL}/predict`, {
                amount: data.amount,
                agency: data.agency,
                vendor: data.vendor
            }, { timeout: 5000 }); // 5s timeout

            return {
                riskScore: response.data.risk_score,
                mlReasons: response.data.reasons,
                isAnomaly: response.data.is_anomaly,
                available: true
            };
        } catch (error: any) {
            console.error("[ML Service] Prediction Failed:", error.message);
            // Fallback Logic
            let fallbackScore = 15;
            let fallbackReasons = ["ML Service Unavailable - Default check"];

            if (data.amount > 500000) {
                fallbackScore = 60;
                fallbackReasons.push("High Value Transaction (Fallback)");
            }

            return {
                riskScore: fallbackScore,
                mlReasons: fallbackReasons,
                isAnomaly: false,
                available: false
            };
        }
    }
}
