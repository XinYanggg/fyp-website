'use client'

import {useParams, useRouter} from 'next/navigation';
import { Search, Plus, Camera } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';
import Breadcrumb from '@/app/components/ui/Breadcrumb';
import PieChart from '@/app/components/charts/PieChart';
import React, { useState } from 'react';
import Modal from '@/app/components/ui/Modal';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';
import NotFound from "@/app/not-found";

/**
 * Farm Detail Page
 * 
 * Shows detailed statistics for a specific farm.
 * 1. Visualizes disease distribution (Pie Chart).
 * 2. Lists all trees with search/filtering.
 * 3. Allows adding new trees and initiating scans.
 */
export default function FarmDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { farms, selectedFarm, setSelectedFarm, setSelectedTree, addTree } = useApp();
    const [showAddTree, setShowAddTree] = useState(false);
    const [treeId, setTreeId] = useState('');
    const [cultivar, setCultivar] = useState('');
    const [searchQuery, setSearchQuery] = useState('');  // Search query state
    const [errorMessage, setErrorMessage] = useState("");

    const { id } = useParams();
    const farm = farms.find(f => f._id === id) || selectedFarm;

    if (!farm) {
        return <NotFound/>;
    }

    const diseaseData = farm.trees.reduce((acc, tree) => {
        acc[tree.currentDisease] = (acc[tree.currentDisease] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const totalTrees = farm.trees.length;
    const pieData = Object.entries(diseaseData).map(([disease, count]) => ({
        disease,
        count,
        percentage: Math.round((count / totalTrees) * 100)
    }));

    const allScans = farm.trees.flatMap(t => t.scans);

    // Filter trees based on search query
    const filteredTrees = farm.trees.filter((tree) => {
        const lowerQuery = searchQuery.toLowerCase();
        return (
            tree.id.toString().toLowerCase().includes(lowerQuery) ||  // Match by tree ID
            tree.cultivar.toLowerCase().includes(lowerQuery) // Match by cultivar
        );
    });

    const handleAddTree = async () => {
        if (treeId && cultivar) {
            if (farm._id) {
                const response = await addTree(String(farm._id), treeId, cultivar);

                if (response?.error) {
                    setErrorMessage(response.error);
                    return;
                }
            } else {
                console.error("Farm ID is undefined");
            }
            setTreeId('');
            setCultivar('');
            setErrorMessage('')
            setShowAddTree(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-orange-50">
            <div className="max-w-7xl mx-auto py-10 px-6">
                <Breadcrumb
                    items={[
                        {label: 'dashboard', onClick: () => router.push('/dashboard')},
                        {label: farm.name}
                    ]}
                />

                <h1 className="text-4xl font-bold mb-8 text-gray-900">{farm.name}</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-semibold text-gray-900 mb-4">Farm Overview</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p><span className="font-medium text-gray-700">Location:</span> {farm.location}</p>
                            <p><span className="font-medium text-gray-700">Total Trees:</span> {farm.trees.length}</p>
                            <p><span className="font-medium text-gray-700">Members:</span> {farm.members.length}</p>
                            <p>
                                <span className="font-medium text-gray-700">Last Scan:</span> {
                                    (() => {
                                        const allScans = farm.trees.map(t => t.lastScan).filter(v => v !== "N/A");
                                        return allScans.length > 0 ? allScans.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] : "N/A";
                                    })()
                                }
                            </p>
                            <p>
                                <span className="font-medium text-gray-700">Healthy:</span> {
                                    (() => {
                                        const healthy = farm.trees.filter(t => t.currentDisease === "Healthy").length;
                                        return ((healthy / farm.trees.length) * 100).toFixed(0) + "%";
                                    })()
                                }
                            </p>
                        </div>
                    </div>

                    {totalTrees > 0 && (
                        <div
                            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-center">
                            <PieChart data={pieData}/>
                        </div>
                    )}

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-semibold text-gray-900 mb-4">Statistics</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p><span
                                className="font-medium text-gray-700">Most common disease:</span> {pieData[0]?.disease || 'N/A'}
                            </p>
                            <p><span
                                className="font-medium text-gray-700">Total scans:</span> {farm.trees.reduce((acc, t) => acc + t.scans.length, 0)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                        <input
                            type="text"
                            placeholder="Search for your tree"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}  // Update search query
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <Button onClick={() => setShowAddTree(true)} className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        <Plus className="w-5 h-5"/>
                        New Tree
                    </Button>
                    <Button onClick={() => router.push(`/scan?farmId=${farm._id}`)}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        <Camera className="w-5 h-5"/>
                        Scan
                    </Button>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tree ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cultivar</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Disease</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Confidence</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Last scan</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredTrees.map((tree) => (
                                    <tr key={tree.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{tree.id}</td>
                                        <td className="px-6 py-4 text-gray-700">{tree.cultivar}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${tree.currentDisease === 'Healthy'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-orange-100 text-orange-800'
                                                }`}>
                                                {tree.currentDisease}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">{tree.confidence}%</td>
                                        <td className="px-6 py-4 text-gray-700">{tree.lastScan}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => {
                                                    setSelectedTree(tree);
                                                    router.push(`/farm/${farm._id}/tree/${tree.id}`);
                                                }}
                                                className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 ease-in-out hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 hover:shadow-md"
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal isOpen={showAddTree} onClose={() => setShowAddTree(false)} title="Add New Tree">
                <div className="space-y-5">
                    <Input
                        label="Tree ID"
                        value={treeId}
                        onChange={(e) => setTreeId(e.target.value)}
                        placeholder="Enter tree ID"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                    <Input
                        label="Durian Cultivar"
                        value={cultivar}
                        onChange={(e) => setCultivar(e.target.value)}
                        placeholder="e.g., Musang King, D24"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                    {/* Error message */}
                    {errorMessage && (
                        <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
                    )}
                    <Button onClick={handleAddTree} className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        Add Tree
                    </Button>
                </div>
            </Modal>
        </div>
    );
}