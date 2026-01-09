"use client";

import { useState, useEffect } from "react";
import { Search, Building2, AlertTriangle, ArrowUpRight } from "lucide-react";
import { Vendor } from "@fds/common";
import Link from "next/link";

export default function VendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>([]);

    useEffect(() => {
        fetch('http://localhost:8000/vendors')
            .then(res => res.json())
            .then(data => setVendors(data));
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Vendor Intelligence</h1>
                    <p className="text-sm text-gray-500">Monitor contractors, suppliers, and direct beneficiaries.</p>
                </div>
                <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-2.5 text-gray-400" />
                    <input type="text" placeholder="Search Vendor Name / GSTIN" className="pl-10 pr-4 py-2 border border-gray-300 rounded-sm w-64 text-sm focus:outline-none focus:border-blue-500" />
                </div>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Entity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GSTIN / ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Volume</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {vendors.map((v) => (
                            <tr key={v.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <Building2 className="h-4 w-4 text-gray-400 mr-3" />
                                        <span className="text-sm font-medium text-gray-900">{v.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{v.gstin}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-1 h-2 w-24 bg-gray-200 rounded-full overflow-hidden mr-2">
                                            <div className={`h-full ${v.riskScore > 80 ? 'bg-red-500' :
                                                    v.riskScore > 50 ? 'bg-orange-500' : 'bg-green-500'
                                                }`} style={{ width: `${v.riskScore}%` }}></div>
                                        </div>
                                        <span className="text-xs font-bold text-gray-700">{v.riskScore}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{(v.totalVolume / 100000).toFixed(2)} L</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${v.accountStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>{v.accountStatus}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <Link href={`/dashboard/vendors/${v.id}`} className="text-blue-600 hover:text-blue-900 text-xs font-medium flex justify-end items-center">
                                        Analysis <ArrowUpRight className="h-3 w-3 ml-1" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
