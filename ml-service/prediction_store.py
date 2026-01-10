# -*- coding: utf-8 -*-
"""
Prediction Storage - Store predictions once, generate profiles later
Architecture: /predict → save prediction with ID, /generate-profile/{id} → load stored prediction
"""

import os
import json
from datetime import datetime
from typing import Dict, Any, Optional, List

from config import PREDICTIONS_STORE


class PredictionStore:
    """
    Store predictions once, generate profiles later
    
    Architecture:
    1. /predict → save prediction with ID
    2. /generate-profile/{id} → load stored prediction, generate profile
    """
    
    @staticmethod
    def save_prediction(tx_input: Dict[str, Any], prediction: Dict[str, Any]) -> str:
        """Save prediction to JSONL store, return prediction ID"""
        try:
            prediction_id = f"PRED-{datetime.utcnow().strftime('%Y%m%d%H%M%S%f')}"
            
            record = {
                "prediction_id": prediction_id,
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "input": tx_input,
                "output": prediction
            }
            
            with open(PREDICTIONS_STORE, "a") as f:
                f.write(json.dumps(record) + "\n")
            
            return prediction_id
        except Exception as e:
            print(f"WARNING: Prediction storage failed: {e}")
            return "PRED-UNKNOWN"
    
    @staticmethod
    def load_prediction(prediction_id: str) -> Optional[Dict[str, Any]]:
        """Load stored prediction by ID"""
        try:
            if not os.path.exists(PREDICTIONS_STORE):
                return None
            
            with open(PREDICTIONS_STORE, "r") as f:
                for line in f:
                    record = json.loads(line)
                    if record.get("prediction_id") == prediction_id:
                        return record
            
            return None
        except Exception as e:
            print(f"WARNING: Prediction load failed: {e}")
            return None
    
    @staticmethod
    def get_vendor_history(vendor: str, limit: int = 100) -> Dict[str, Any]:
        """
        Query vendor historical data from predictions_store.jsonl
        
        Returns vendor statistics and recent transactions for Ollama context
        """
        try:
            if not os.path.exists(PREDICTIONS_STORE):
                return {
                    "totalTransactions": 0,
                    "averageAmount": 0,
                    "totalVolume": 0,
                    "highRiskCount": 0,
                    "averageRiskScore": 0,
                    "recentTransactions": []
                }
            
            vendor_records = []
            
            # Read all predictions for this vendor
            with open(PREDICTIONS_STORE, "r") as f:
                for line in f:
                    try:
                        record = json.loads(line)
                        tx_input = record.get("input", {})
                        tx_output = record.get("output", {})
                        
                        # Match vendor
                        if tx_input.get("vendor", "").lower() == vendor.lower():
                            vendor_records.append({
                                "amount": tx_input.get("amount", 0),
                                "riskScore": tx_output.get("risk_score", 0),
                                "fraudScore": tx_output.get("fraud_score", 0),
                                "timestamp": record.get("timestamp", ""),
                                "agency": tx_input.get("agency", "Unknown"),
                                "isAnomaly": tx_output.get("is_anomaly", False)
                            })
                    except json.JSONDecodeError:
                        continue
            
            # Calculate statistics
            total_transactions = len(vendor_records)
            
            if total_transactions == 0:
                return {
                    "totalTransactions": 0,
                    "averageAmount": 0,
                    "totalVolume": 0,
                    "highRiskCount": 0,
                    "averageRiskScore": 0,
                    "recentTransactions": []
                }
            
            total_volume = sum(r["amount"] for r in vendor_records)
            average_amount = total_volume / total_transactions
            high_risk_count = sum(1 for r in vendor_records if r["riskScore"] >= 70)
            average_risk_score = sum(r["riskScore"] for r in vendor_records) / total_transactions
            
            # Get recent transactions (sorted by timestamp, most recent first)
            recent_transactions = sorted(
                vendor_records,
                key=lambda x: x["timestamp"],
                reverse=True
            )[:5]
            
            return {
                "totalTransactions": total_transactions,
                "averageAmount": average_amount,
                "totalVolume": total_volume,
                "highRiskCount": high_risk_count,
                "averageRiskScore": average_risk_score,
                "recentTransactions": recent_transactions
            }
            
        except Exception as e:
            print(f"WARNING: Vendor history query failed: {e}")
            return {
                "totalTransactions": 0,
                "averageAmount": 0,
                "totalVolume": 0,
                "highRiskCount": 0,
                "averageRiskScore": 0,
                "recentTransactions": []
            }
