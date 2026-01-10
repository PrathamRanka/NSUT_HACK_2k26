'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Loader2, CheckCircle, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';

export default function AddPaymentForm() {
    const [formData, setFormData] = useState({
        amount: '',
        scheme: '',
        vendor: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const { data } = await api.post('/alerts', {
                amount: Number(formData.amount),
                scheme: formData.scheme,
                vendor: formData.vendor,
                description: formData.description
            });
            setResult(data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Transaction failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldCheck className="w-8 h-8 opacity-90" />
                        <h2 className="text-2xl font-bold tracking-tight">Secure Payment Gateway</h2>
                    </div>
                    <p className="text-blue-100 opacity-90">Process transaction with real-time AI fraud detection</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Amount (₹)</label>
                                <input
                                    type="number"
                                    name="amount"
                                    required
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-900"
                                    placeholder="e.g. 50000"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Scheme / Agency</label>
                                <select
                                    name="scheme"
                                    required
                                    value={formData.scheme}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-gray-900"
                                >
                                    <option value="">Select Scheme</option>
                                    <option value="PM-KISAN">PM-KISAN</option>
                                    <option value="MGNREGA">MGNREGA</option>
                                    <option value="PMAY-G">PMAY-G</option>
                                    <option value="Health Ministry">Health Ministry</option>
                                </select>
                            </div>

                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Vendor ID / Name</label>
                                <input
                                    type="text"
                                    name="vendor"
                                    required
                                    value={formData.vendor}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-900"
                                    placeholder="e.g. VEN-882 (Rural Infra Builders)"
                                />
                            </div>

                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Description (Optional)</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={2}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-900"
                                    placeholder="Purpose of payment..."
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Analyzing Transaction...
                                </>
                            ) : (
                                'Process Payment'
                            )}
                        </button>
                    </form>

                    {/* RESULTS SECTION */}
                    {result && (
                        <div className={`mt-8 p-6 rounded-xl border-l-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ${result.riskLevel === 'Critical' ? 'bg-red-50 border-red-500' :
                            result.riskLevel === 'High' ? 'bg-orange-50 border-orange-500' :
                                'bg-green-50 border-green-500'
                            }`}>
                            <div className="flex items-start gap-4">
                                {result.riskLevel === 'Critical' ? <XCircle className="w-8 h-8 text-red-600" /> :
                                    result.riskLevel === 'High' ? <AlertTriangle className="w-8 h-8 text-orange-600" /> :
                                        <CheckCircle className="w-8 h-8 text-green-600" />}

                                <div className="flex-1">
                                    <h3 className={`text-xl font-bold mb-1 ${result.riskLevel === 'Critical' ? 'text-red-800' :
                                        result.riskLevel === 'High' ? 'text-orange-800' :
                                            'text-green-800'
                                        }`}>
                                        Risk Assessment: {result.riskLevel}
                                    </h3>
                                    <div className="text-sm font-medium opacity-80 mb-4">
                                        Fraud Score: <span className="text-lg font-bold">{result.riskScore}/100</span>
                                    </div>

                                    {result.mlReasons && result.mlReasons.length > 0 && (
                                        <div className="bg-white/60 p-4 rounded-lg">
                                            <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2">Analysis Findings</p>
                                            <ul className="space-y-1">
                                                {result.mlReasons.map((r: string, i: number) => (
                                                    <li key={i} className="text-sm font-medium flex items-center gap-2 text-gray-800">
                                                        • {r}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="mt-4 text-xs text-gray-500">
                                        Alert ID: {result.id} | Timestamp: {new Date(result.timestamp).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-3">
                            <XCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="font-medium">{error}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
