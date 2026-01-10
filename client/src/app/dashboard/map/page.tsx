"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import api from '@/lib/api';

// Simplified India Map Coords for Demo
const DISTRICT_COORDS: Record<string, { cx: number, cy: number, name: string }> = {
    "Lucknow": { cx: 300, cy: 200, name: "Lucknow" },
    "Patna": { cx: 450, cy: 220, name: "Patna" },
    "Mumbai": { cx: 150, cy: 400, name: "Mumbai" },
    "New Delhi": { cx: 280, cy: 150, name: "New Delhi" },
};

export default function MapPage() {
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
    const [districts, setDistricts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState<any[]>([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/alerts');
            setAlerts(data);

            // Aggregate Data
            const agg: Record<string, { risk: number, count: number }> = {};

            // Initialize with all known districts (zero stats)
            Object.keys(DISTRICT_COORDS).forEach(d => {
                agg[d] = { risk: 0, count: 0 };
            });

            data.forEach((alert: any) => {
                const dist = alert.district || "Lucknow"; // Default fallback
                if (agg[dist]) {
                    agg[dist].count++;
                    agg[dist].risk = Math.max(agg[dist].risk, alert.riskScore); // Track max risk
                }
            });

            // Convert to Array for Map
            const mapData = Object.keys(agg).map(key => ({
                id: key,
                ...DISTRICT_COORDS[key],
                risk: agg[key].risk,
                count: agg[key].count
            })).filter(d => d.count > 0); // Only show active

            setDistricts(mapData);

        } catch (e) {
            console.error("Map fetch failed", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const selectedStats = selectedDistrict ? districts.find(d => d.name === selectedDistrict) : null;
    const districtAlerts = selectedDistrict ? alerts.filter(a => a.district === selectedDistrict && a.status === 'New').length : 0;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Geospatial Risk Heatmap</h1>
                    <p className="text-sm text-gray-500">District-wise anomaly concentration (Live Data).</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button onClick={fetchData} className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-50">
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <div className="flex items-center capitalize space-x-2 text-sm text-gray-500">
                        <span className="flex items-center"><span className="block w-3 h-3 bg-red-500 rounded-full mr-1"></span> Critical</span>
                        <span className="flex items-center"><span className="block w-3 h-3 bg-orange-500 rounded-full mr-1"></span> High</span>
                        <span className="flex items-center"><span className="block w-3 h-3 bg-yellow-500 rounded-full mr-1"></span> Medium</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map Viewer */}
                <div className="lg:col-span-2 bg-slate-900 rounded-lg shadow-lg relative h-[500px] flex items-center justify-center overflow-hidden border border-slate-700">
                    {/* Abstract India Map Outline (SVG) */}
                    <svg viewBox="0 0 600 600" className="w-[80%] h-[80%] opacity-80">
                        <path d="M 280 50 L 350 100 L 450 200 L 400 400 L 300 550 L 150 450 L 100 300 L 280 50" fill="none" stroke="#475569" strokeWidth="2" />

                        {/* Render Hotspots */}
                        {districts.map(d => (
                            <g key={d.id}
                                className="cursor-pointer transition-transform hover:scale-110"
                                onClick={() => setSelectedDistrict(d.name)}
                            >
                                {/* Pulse Effect */}
                                <circle cx={d.cx} cy={d.cy} r={20 + (d.count * 2)} className="animate-ping opacity-20" fill={d.risk > 80 ? "#ef4444" : "#f97316"} />
                                <circle cx={d.cx} cy={d.cy} r={8 + d.count} fill={d.risk > 80 ? "#ef4444" : "#f97316"} stroke="white" strokeWidth="2" />
                                <text x={d.cx} y={d.cy + 30} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{d.name}</text>
                                <text x={d.cx} y={d.cy + 42} textAnchor="middle" fill="#cbd5e1" fontSize="10">({d.count})</text>
                            </g>
                        ))}
                    </svg>

                    <div className="absolute top-4 right-4 bg-slate-800 p-3 rounded text-xs text-slate-300 border border-slate-600">
                        <p className="font-bold text-white mb-1">Live Feed</p>
                        <p>Total Alerts: {alerts.length}</p>
                        <p>Active Hotspots: {districts.length}</p>
                    </div>
                </div>

                {/* Drilldown Panel */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    {selectedDistrict ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">{selectedDistrict} Region</h2>
                                <span className={`text-white text-xs px-2 py-1 rounded-full font-bold ${(selectedStats?.risk || 0) > 80 ? 'bg-red-600' : 'bg-orange-500'
                                    }`}>
                                    {(selectedStats?.risk || 0) > 80 ? 'Critical Risk' : 'High Risk'}
                                </span>
                            </div>

                            <div className="p-4 bg-red-50 border border-red-100 rounded-sm">
                                <p className="text-sm text-red-800 font-medium flex items-center">
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    {districtAlerts} Active Alerts Detected
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-gray-700 uppercase">Recent Activity</h3>
                                <div className="max-h-60 overflow-y-auto space-y-2">
                                    {alerts.filter(a => a.district === selectedDistrict).slice(0, 5).map(alert => (
                                        <div key={alert.id} className="text-xs p-2 bg-gray-50 border border-gray-100 rounded">
                                            <div className="flex justify-between font-bold text-gray-800">
                                                <span>{alert.id}</span>
                                                <span className={alert.riskScore > 80 ? "text-red-600" : "text-orange-600"}>{alert.riskScore}</span>
                                            </div>
                                            <div className="text-gray-500 mt-1 truncate">{alert.mlReasons?.[0] || "Suspicious Activity"}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button className="w-full mt-4 bg-blue-900 text-white py-2 rounded-sm text-sm font-medium hover:bg-blue-800">
                                View District Report
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                            <MapIcon className="h-12 w-12 text-gray-300 mb-2" />
                            <p>Select a region on the map to analyze risk factors.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function MapIcon(props: any) {
    return <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 21 15 18 9 21 3 18 3 6" /><line x1="9" x2="9" y1="3" y2="21" /><line x1="15" x2="15" y1="6" y2="24" /></svg>
}
