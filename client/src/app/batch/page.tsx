'use client';
import { useState } from 'react';
import { Upload, FileUp, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';
import axios from 'axios';

export default function BatchUploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [stats, setStats] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

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

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Assuming API Gateway is proxied or we use full URL
            // Adjust URL based on your setup. Usually localhost:4000 for gateway.
            const response = await axios.post('http://localhost:4000/batch/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                setStats(response.data.stats);
            } else {
                setError('Upload failed but no specific error returned.');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || err.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Batch Processing</h1>
                <p className="text-gray-600">
                    Upload a CSV file containing transaction data for bulk fraud analysis.
                </p>
            </div>

            {/* Upload Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                        Drag and drop your CSV file here
                    </p>
                    <p className="text-sm text-gray-500 mb-6">or click to browse</p>

                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg cursor-pointer transition-colors"
                    >
                        Select File
                    </label>

                    {file && (
                        <div className="mt-4 flex items-center gap-2 text-gray-700 bg-blue-50 px-4 py-2 rounded-md">
                            <FileUp className="w-5 h-5 text-blue-600" />
                            <span className="font-medium">{file.name}</span>
                            <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className={`px-6 py-2.5 font-medium rounded-lg transition-colors flex items-center gap-2
              ${!file || uploading
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 text-white'}`}
                    >
                        {uploading ? 'Processing...' : 'Start Batch Analysis'}
                    </button>
                </div>

                {error && (
                    <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        {error}
                    </div>
                )}
            </div>

            {/* Stats Results */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Rows</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalRows}</h3>
                        </div>
                        <div className="p-3 bg-gray-100 rounded-lg">
                            <FileUp className="w-6 h-6 text-gray-600" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Processed Successfully</p>
                            <h3 className="text-3xl font-bold text-green-600 mt-2">{stats.processed}</h3>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm flex items-start justify-between relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-red-600">High Risk Detected</p>
                            <h3 className="text-3xl font-bold text-red-700 mt-2">{stats.highRisk}</h3>
                        </div>
                        <div className="p-3 bg-red-100 rounded-lg relative z-10">
                            <AlertOctagon className="w-6 h-6 text-red-600" />
                        </div>

                        {/* Background pattern for emphasis */}
                        <div className="absolute inset-0 bg-red-50 opacity-50"></div>
                    </div>

                    <div className="col-span-1 md:col-span-3">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-blue-900">Analysis Complete</p>
                                    <p className="text-sm text-blue-700">All alerts have been generated and synced with the dashboard and geospatial map.</p>
                                </div>
                            </div>
                            <a href="/dashboard/alerts" className="text-sm font-medium text-blue-700 hover:text-blue-800 hover:underline">
                                View Alerts &rarr;
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
