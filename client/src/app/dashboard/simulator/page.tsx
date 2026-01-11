"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { AlertTriangle, ShieldCheck, RefreshCw, Zap, Sliders } from "lucide-react";

export default function SimulatorPage() {
    const [amount, setAmount] = useState(50000);
    const [vendor, setVendor] = useState("Simulated Vendor");
    const [scheme, setScheme] = useState("Simulated Scheme");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    // Debounce simulation trigger
    useEffect(() => {
        const timer = setTimeout(() => {
            runSimulation();
        }, 800); // 800ms debounce
        return () => clearTimeout(timer);
    }, [amount, vendor, scheme]);

    const runSimulation = async () => {
        setLoading(true);
        try {
            const res = await api.post('/simulator/predict', {
                amount,
                vendor,
                scheme
            });
            setResult(res.data.prediction);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (score: number) => {
        if (score > 70) return "text-red-600";
        if (score > 40) return "text-amber-500";
        return "text-green-600";
    };

    const getRiskBg = (score: number) => {
        if (score > 70) return "bg-red-50 border-red-200";
        if (score > 40) return "bg-amber-50 border-amber-200";
        return "bg-green-50 border-green-200";
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Zap className="h-6 w-6 text-amber-500" />
                        Fraud Simulation Playground
                    </h1>
                    <p className="text-sm text-gray-500">Test the AI engine with hypothetical scenarios. No data is saved.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Controls Panel */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-8">
                    <div className="flex items-center gap-2 mb-4 border-b pb-2">
                        <Sliders className="h-5 w-5 text-gray-500" />
                        <h2 className="font-semibold text-gray-800">Parameters</h2>
                    </div>

                    {/* Amount Slider */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">Transaction Amount</label>
                            <span className="text-sm font-mono font-bold text-blue-600">₹{amount.toLocaleString()}</span>
                        </div>
                        <input
                            type="range"
                            min="1000"
                            max="10000000" // 1 Cr
                            step="1000"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>₹1k</span>
                            <span>₹1 Cr</span>
                        </div>
                    </div>

                    {/* Vendor Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name</label>
                        <select
                            value={vendor}
                            onChange={(e) => setVendor(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm bg-gray-50"
                        >
                            <option value="Simulated Vendor">Simulated Vendor (Generic)</option>
                            <option value="Rural Infra Builders">Rural Infra Builders (High Risk History)</option>
                            <option value="Agro Tech Supplies">Agro Tech Supplies (Safe History)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Select known vendors to test history-based flags.</p>
                    </div>

                    {/* Scheme Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Scheme Context</label>
                        <input
                            type="text"
                            value={scheme}
                            onChange={(e) => setScheme(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm"
                            placeholder="Entèr Scheme Name..."
                        />
                    </div>
                </div>

                {/* Results Panel */}
                <div className="bg-gray-900 rounded-lg p-8 flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

                    {loading && (
                        <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center backdrop-blur-sm">
                            <RefreshCw className="h-8 w-8 text-white animate-spin" />
                        </div>
                    )}

                    {!result && !loading && (
                        <div className="text-center text-gray-400">
                            <Zap className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>Adjust parameters to see AI prediction</p>
                        </div>
                    )}

                    {result && (
                        <div className="w-full max-w-sm relative z-0">
                            {/* Gauge / Score Display */}
                            <div className="text-center mb-8">
                                <div className={`text-6xl font-black font-mono tracking-tighter mb-2 ${getRiskColor(result.riskScore)}`}>
                                    {result.riskScore}
                                </div>
                                <div className="text-gray-400 uppercase tracking-widest text-xs font-semibold">Risk Score</div>
                            </div>

                            {/* Anomaly Badge */}
                            <div className="flex justify-center mb-8">
                                {result.isAnomaly ? (
                                    <span className="px-4 py-1 bg-red-500/20 border border-red-500/50 text-red-400 rounded-full text-sm font-bold flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4" /> Anomaly Detected
                                    </span>
                                ) : (
                                    <span className="px-4 py-1 bg-green-500/20 border border-green-500/50 text-green-400 rounded-full text-sm font-bold flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4" /> Pattern Normal
                                    </span>
                                )}
                            </div>

                            {/* Reasons List */}
                            <div className="bg-gray-800/80 rounded-lg p-4 border border-gray-700 backdrop-blur">
                                <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">Detection Logic</h3>
                                <ul className="space-y-2">
                                    {result.mlReasons && result.mlReasons.length > 0 ? (
                                        result.mlReasons.map((reason: string, idx: number) => (
                                            <li key={idx} className="text-sm text-gray-200 flex items-start gap-2">
                                                <span className="text-amber-500 mt-0.5">•</span>
                                                {reason}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-sm text-gray-500 italic">No specific risk flags raised.</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
