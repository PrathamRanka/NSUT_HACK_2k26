"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactFlow, {
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    MarkerType,
    Position,
    Handle
} from 'reactflow';
import 'reactflow/dist/style.css';
import { RefreshCw, Search, ShieldAlert, Share2, Info, ArrowUpRight } from 'lucide-react';
import api from "@/lib/api";
import { Vendor } from "@fds/common";
import { useRouter } from 'next/navigation';

// --- Custom Node Component ---
const EntityNode = ({ data }: { data: any }) => {
    return (
        <div
            className={`
                group relative w-64 bg-white rounded-lg shadow-lg border-l-4 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer
                ${data.riskScore > 70 ? 'border-red-500' : data.riskScore > 40 ? 'border-amber-500' : 'border-green-500'}
            `}
            onClick={() => window.location.href = `/dashboard/vendors/${data.id}`}
        >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-lg">
                <span className="text-sm font-bold text-gray-800 truncate" title={data.label}>
                    {data.label}
                </span>
                <span className={`
                    text-[10px] font-bold px-2 py-0.5 rounded-full
                    ${data.riskScore > 70 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}
                `}>
                    Risk: {data.riskScore}
                </span>
            </div>

            {/* Body */}
            <div className="px-4 py-3 space-y-2">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Volume</span>
                    <span className="font-mono font-medium text-gray-700">₹{((data.volume || 0) / 100000).toFixed(1)}L</span>
                </div>

                {data.sharedSchemes && (
                    <div className="text-[10px] text-gray-500 mt-2 p-2 bg-blue-50/50 rounded border border-blue-100">
                        <span className="font-semibold text-blue-700 block mb-1">Shared Schemes:</span>
                        <div className="line-clamp-2 leading-relaxed">{data.sharedSchemes}</div>
                    </div>
                )}

                {data.sharedBeneficiaries && data.sharedBeneficiaries.length > 0 && (
                    <div className="text-[10px] bg-red-50 p-2 rounded border border-red-100 mt-1">
                        <span className="font-bold text-red-600 block mb-1 flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> Collusion Risk
                        </span>
                        <span className="text-gray-600">Shared Beneficiaries Detected</span>
                    </div>
                )}
            </div>

            {/* Hover Tooltip (Bottom Action) */}
            <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] py-1 text-center rounded-b-lg">
                Click to Analyze Profile <ArrowUpRight className="inline w-3 h-3 ml-1" />
            </div>

            <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-gray-400" />
            <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-gray-400" />
        </div>
    );
};

const nodeTypes = {
    input: EntityNode, // Re-use for center node too, or make a larger one
    custom: EntityNode,
};

export default function NetworkPage() {
    const searchParams = useSearchParams();
    const entityId = searchParams.get('entityId') || 'VEN-991';

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesState] = useEdgesState([]);
    const [loading, setLoading] = useState(true);
    const [vendors, setVendors] = useState<Vendor[]>([]);

    useEffect(() => {
        api.get('/vendors').then(res => setVendors(res.data)).catch(console.error);
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/network/${entityId}`);
            const data = res.data;

            // Map nodes to use custom type
            const enhancedNodes = data.nodes.map((n: any) => ({
                ...n,
                type: 'custom',
                data: { ...n.data }
            }));

            // Enhance edges for aesthetics
            const enhancedEdges = data.edges.map((e: any) => ({
                ...e,
                type: 'smoothstep', // Better looking than straight
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 20,
                    height: 20,
                    color: e.style.stroke,
                },
                animated: true,
            }));

            setNodes(enhancedNodes);
            setEdges(enhancedEdges);
        } catch (e) {
            console.error("Graph fetch failed", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, [entityId]);

    const handleVendorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        window.location.href = `?entityId=${e.target.value}`;
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col space-y-4 relative">
            {/* Summary Header */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-blue-600" />
                        Entity Link Analysis
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Detect <span className="font-semibold text-gray-700">Circular Trading</span> & <span className="font-semibold text-gray-700">Collusion Rings</span> via shared metadata.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                        <select
                            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 min-w-[250px]"
                            value={entityId}
                            onChange={handleVendorChange}
                        >
                            <option value="">Select Vendor...</option>
                            {vendors.map(v => (
                                <option key={v.id} value={v.id}>{v.name} ({v.id})</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={fetchData}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Refresh Graph"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="flex gap-4 h-full">
                {/* Main Graph Area */}
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl shadow-inner overflow-hidden relative">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesState}
                        nodeTypes={nodeTypes}
                        fitView
                        attributionPosition="bottom-right"
                    >
                        <Background color="#cbd5e1" gap={20} size={1} />
                        <Controls className="bg-white border border-gray-200 shadow-sm rounded-md overflow-hidden" />
                    </ReactFlow>

                    {loading && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 backdrop-blur-[2px]">
                            <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-xl border border-gray-100">
                                <RefreshCw className="h-6 w-6 text-blue-600 animate-spin mb-3" />
                                <p className="text-sm font-semibold text-gray-800">Tracing Vendor Connections...</p>
                                <p className="text-xs text-gray-500 mt-1">Analyzing shared beneficiaries & schemes</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Intelligence */}
                <div className="w-80 flex flex-col gap-4">
                    {/* Key Insights Panel */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                            <Info className="w-4 h-4 text-blue-600" />
                            <h3 className="text-sm font-bold text-gray-900">Analysis Guide</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-3 items-start">
                                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                                    <ShieldAlert className="w-4 h-4 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-900">High Risk Contagion</p>
                                    <p className="text-[10px] text-gray-500 leading-tight mt-1">
                                        Vendors connected to High Risk entities via <span className="text-red-600 font-medium">Shared Beneficiaries</span> are likely co-conspirators.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 items-start">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                    <Share2 className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-900">Scheme Stacking</p>
                                    <p className="text-[10px] text-gray-500 leading-tight mt-1">
                                        Multiple vendors applying for the <span className="text-blue-600 font-medium">same set of schemes</span> may indicate cartelization.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex-1">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Graph Legend</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                                <span className="text-xs font-medium text-gray-700">Central Node</span>
                                <span className="w-3 h-3 bg-red-500 rounded-full ring-2 ring-red-200"></span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                                <span className="text-xs font-medium text-gray-700">Safe Entity</span>
                                <span className="w-3 h-3 bg-green-500 rounded-full border border-green-600"></span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                                <span className="text-xs font-medium text-gray-700">High Risk Entity</span>
                                <span className="w-3 h-3 bg-amber-500 rounded-full border border-amber-600"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
