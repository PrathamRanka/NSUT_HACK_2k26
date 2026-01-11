"use client";

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import api from '@/lib/api';
import { Info, ZoomIn, ZoomOut, RefreshCw, Layers } from 'lucide-react';

// Dynamic import for No-SSR to prevent hydration mismatch with canvas
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function NetworkPage() {
    const [data, setData] = useState({ nodes: [], links: [] });
    const [loading, setLoading] = useState(true);
    const [selectedNode, setSelectedNode] = useState<any>(null);
    const graphRef = useRef<any>();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/network/graph');
            setData(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getNodeColor = (node: any) => {
        if (node.type === 'Ministry') return '#4f46e5'; // Indigo
        if (node.type === 'Scheme') return '#0ea5e9'; // Sky
        if (node.type === 'Vendor') return '#10b981'; // Emerald
        return '#9ca3af';
    };

    const handleNodeClick = (node: any) => {
        setSelectedNode(node);
        // Focus camera on node
        graphRef.current?.centerAt(node.x, node.y, 1000);
        graphRef.current?.zoom(3, 2000);
    };

    return (
        <div className="h-[calc(100vh-100px)] relative bg-gray-900 overflow-hidden rounded-lg shadow-2xl border border-gray-800">
            {/* Header Overlay */}
            <div className="absolute top-4 left-4 z-10 bg-gray-900/90 backdrop-blur border border-gray-700 p-4 rounded-lg shadow-lg max-w-sm">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    <Layers className="h-5 w-5 text-indigo-400" />
                    Money Trail Network
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                    Visualizing flow from <span className="text-indigo-400">Ministries</span> → <span className="text-sky-400">Schemes</span> → <span className="text-emerald-400">Vendors</span>.
                </p>
                <div className="flex gap-2 mt-3">
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        <span className="text-xs text-gray-300">Govt</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                        <span className="text-xs text-gray-300">Scheme</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-xs text-gray-300">Vendor</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <button onClick={fetchData} className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded border border-gray-700 shadow" title="Refresh">
                    <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button onClick={() => graphRef.current?.zoomToFit(400)} className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded border border-gray-700 shadow" title="Reset View">
                    <ZoomOut className="h-5 w-5" />
                </button>
            </div>

            {/* Main Graph */}
            {!loading && (
                <ForceGraph2D
                    ref={graphRef}
                    graphData={data}
                    nodeLabel="label"
                    nodeColor={getNodeColor}
                    nodeRelSize={6}
                    linkColor={() => '#374151'} // Gray-700
                    linkWidth={link => (link as any).value || 1}
                    linkDirectionalParticles={2}
                    linkDirectionalParticleSpeed={d => (d as any).value * 0.001 + 0.001}
                    backgroundColor="#111827" // Gray-900
                    onNodeClick={handleNodeClick}
                    d3VelocityDecay={0.3}
                    cooldownTicks={100}
                />
            )}

            {/* Loading State */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                    <div className="animate-pulse flex flex-col items-center">
                        <RefreshCw className="h-10 w-10 animate-spin text-indigo-500 mb-2" />
                        <span className="text-sm font-light tracking-wide">TRACING FUNDS...</span>
                    </div>
                </div>
            )}

            {/* Detail Sidebar (Flyout) */}
            {selectedNode && (
                <div className="absolute top-20 right-4 z-20 w-72 bg-gray-900/95 backdrop-blur border border-gray-700 p-4 rounded-lg shadow-2xl transition-all animate-in slide-in-from-right">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-white">{selectedNode.label}</h3>
                        <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-white">✕</button>
                    </div>
                    <span className={`px-2 py-0.5 text-xs rounded font-medium ${selectedNode.type === 'Vendor' ? 'bg-emerald-900 text-emerald-300' :
                            selectedNode.type === 'Scheme' ? 'bg-sky-900 text-sky-300' : 'bg-indigo-900 text-indigo-300'
                        }`}>
                        {selectedNode.type}
                    </span>

                    <div className="mt-4 space-y-2">
                        {selectedNode.type === 'Vendor' && (
                            <>
                                <div className="text-sm text-gray-400">Risk Score</div>
                                <div className="text-xl font-mono text-white">N/A</div>
                            </>
                        )}
                        {selectedNode.type === 'Scheme' && (
                            <>
                                <div className="text-sm text-gray-400">Total Outflow</div>
                                <div className="text-xl font-mono text-white">High</div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
