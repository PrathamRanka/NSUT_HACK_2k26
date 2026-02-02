"use client";

import { useState, useEffect } from "react";
import { Upload, FileUp, CheckCircle, AlertTriangle, AlertOctagon, Sparkles, Loader2, BrainCircuit, ShieldAlert } from "lucide-react";
import axios from "axios";
import { colors } from "@/styles/design-system";

export default function BatchUploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [stats, setStats] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [processingStep, setProcessingStep] = useState<string>("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
            setStats(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);
        setStats(null);

        // Simulated AI Steps
        const steps = [
            "Tokenizing transaction data...",
            "Vectorizing vendor patterns...",
            "Running Random Forest Model...",
            "Detecting anomalies...",
            "Finalizing risk scores..."
        ];

        let stepIndex = 0;
        const interval = setInterval(() => {
            if (stepIndex < steps.length) {
                setProcessingStep(steps[stepIndex]);
                stepIndex++;
            }
        }, 800);

        const formData = new FormData();
        formData.append("file", file);

        try {
            // Artificial delay to show the cool animations (min 4 seconds)
            const [response] = await Promise.all([
                axios.post("http://localhost:4000/batch/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                }),
                new Promise(resolve => setTimeout(resolve, 4000))
            ]);

            if (response.data.success) {
                clearInterval(interval);
                setProcessingStep("Analysis Complete");
                setStats(response.data.stats);
            } else {
                throw new Error("Upload failed but no specific error returned.");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || err.message || "Upload failed");
        } finally {
            clearInterval(interval);
            setUploading(false);
            setProcessingStep("");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 sm:p-8 lg:p-12 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50 to-transparent -z-10 pointer-events-none" />
            <div className="absolute top-10 right-10 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-40 -z-10 animate-pulse decoration-clone" />

            <div className="max-w-5xl mx-auto space-y-8 relative z-10">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center gap-3">
                        <BrainCircuit className="h-10 w-10 text-blue-600" />
                        AI Batch Processor
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Upload bulk transaction datasets for high-speed, AI-powered fraud detection.
                    </p>
                </div>

                {/* Upload Card */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 overflow-hidden relative group transition-all hover:shadow-2xl hover:border-blue-100">
                    {/* Subtle Animated Border Gradient */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

                    <div className="p-8 sm:p-12">
                        {!uploading ? (
                            <div className="flex flex-col items-center justify-center transition-all">
                                <div className="w-full max-w-xl border-2 border-dashed border-blue-200 rounded-2xl p-10 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-400 transition-all cursor-pointer group/drop"
                                    onClick={() => document.getElementById("file-upload")?.click()}
                                >
                                    <div className="flex flex-col items-center gap-4 text-center">
                                        <div className="p-4 bg-white rounded-full shadow-sm group-hover/drop:scale-110 transition-transform duration-300">
                                            <Upload className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-xl font-semibold text-gray-900">
                                                Drop CSV file here
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                </div>

                                {file && (
                                    <div className="mt-6 flex items-center gap-3 bg-white border border-gray-200 px-5 py-3 rounded-xl shadow-sm animate-in fade-in slide-in-from-bottom-2">
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <FileUp className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-medium text-gray-900">{file.name}</p>
                                            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                            className="ml-2 p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}

                                <div className="mt-8">
                                    <button
                                        onClick={handleUpload}
                                        disabled={!file}
                                        className={`px-8 py-3.5 text-lg font-bold text-white rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2
                                            ${!file
                                                ? "bg-gray-300 cursor-not-allowed shadow-none"
                                                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/30"
                                            }`}
                                    >
                                        <Sparkles className="w-5 h-5" />
                                        Start AI Analysis
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 space-y-6 animate-in fade-in zoom-in-95 duration-500">
                                <div className="relative">
                                    <div className="w-24 h-24 border-4 border-blue-100 rounded-full animate-spin-slow"></div>
                                    <div className="absolute inset-0 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <BrainCircuit className="w-8 h-8 text-blue-600 animate-pulse" />
                                    </div>
                                </div>
                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-bold text-gray-900">Processing Data</h3>
                                    <p className="text-blue-600 font-medium font-mono min-h-[1.5rem] transition-all">
                                        {processingStep}
                                    </p>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-3 animate-in shake">
                                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                <p className="font-medium">{error}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Section */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-700 fade-in fill-mode-forwards delay-150">
                        {/* Total Rows */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition-all group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Transactions</p>
                                    <h3 className="text-4xl font-extrabold text-gray-900 mt-2 group-hover:scale-105 transition-transform origin-left">
                                        {stats.totalRows.toLocaleString()}
                                    </h3>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                                    <FileUp className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                </div>
                            </div>
                        </div>

                        {/* Processed Successfully */}
                        <div className="bg-white p-6 rounded-xl border border-green-100 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-24 h-24 bg-green-50 rounded-full -mr-12 -mt-12 opacity-50 transition-transform group-hover:scale-150" />
                            <div className="flex justify-between items-start relative z-10">
                                <div>
                                    <p className="text-sm font-medium text-green-700 uppercase tracking-wider">Processed</p>
                                    <h3 className="text-4xl font-extrabold text-green-600 mt-2 group-hover:scale-105 transition-transform origin-left">
                                        {stats.processed.toLocaleString()}
                                    </h3>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                </div>
                            </div>
                        </div>

                        {/* High Risk */}
                        <div className="bg-white p-6 rounded-xl border border-red-100 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-24 h-24 bg-red-50 rounded-full -mr-12 -mt-12 opacity-50 transition-transform group-hover:scale-150" />
                            <div className="flex justify-between items-start relative z-10">
                                <div>
                                    <p className="text-sm font-medium text-red-700 uppercase tracking-wider">Fraud Detected</p>
                                    <h3 className="text-4xl font-extrabold text-red-600 mt-2 group-hover:scale-105 transition-transform origin-left">
                                        {stats.highRisk.toLocaleString()}
                                    </h3>
                                </div>
                                <div className="p-3 bg-red-50 rounded-lg animate-pulse">
                                    <ShieldAlert className="w-6 h-6 text-red-500" />
                                </div>
                            </div>
                        </div>

                        {/* Success Banner */}
                        <div className="col-span-1 md:col-span-3 mt-4">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-1 shadow-lg transform hover:scale-[1.01] transition-transform">
                                <div className="bg-white rounded-[10px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-blue-100 rounded-full">
                                            <CheckCircle className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Batch Analysis Complete</p>
                                            <p className="text-sm text-gray-600">All predictions have been synchronized with the central dashboard.</p>
                                        </div>
                                    </div>
                                    <a href="/dashboard/alerts" className="px-6 py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap">
                                        View Results &rarr;
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
