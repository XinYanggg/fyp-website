'use client'

import { useRouter } from 'next/navigation';
import { Search, Plus } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';
import { useState } from 'react';
import Modal from '@/app/components/ui/Modal';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';

export default function DashboardPage() {
    const router = useRouter();
    const { user, farms, setSelectedFarm, addFarm, addMember, removeMember } = useApp();
    const [showAddFarm, setShowAddFarm] = useState(false);
    const [showManageMember, setShowManageMember] = useState(false);
    const [selectedFarmForMember, setSelectedFarmForMember] = useState<string | null>(null);
    const [farmName, setFarmName] = useState('');
    const [farmLocation, setFarmLocation] = useState('');
    const [memberEmail, setMemberEmail] = useState('');

    const handleAddFarm = () => {
        if (farmName && farmLocation) {
            addFarm(farmName, farmLocation);
            setFarmName('');
            setFarmLocation('');
            setShowAddFarm(false);
        }
    };

    const handleAddMember = () => {
        if (selectedFarmForMember && memberEmail) {
            addMember(selectedFarmForMember, memberEmail);
            setMemberEmail('');
        }
    };

    const farm = farms.find(f => f.id === selectedFarmForMember);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-orange-50">
            <div className="max-w-7xl mx-auto py-10 px-6">
                <h1 className="text-4xl font-bold mb-3 text-gray-900">Welcome Back, {user?.name}!</h1>
                <p className="text-gray-600 mb-10 text-lg">Here&#39;s how your durian trees are doing</p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search for your farm"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <Button onClick={() => setShowAddFarm(true)} className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        <Plus className="w-5 h-5" />
                        Add Farm
                    </Button>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Farm</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Trees</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Members</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {farms.map((f) => (
                            <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => {
                                            setSelectedFarm(f);
                                            router.push(`/farm/${f.id}`);
                                        }}
                                        className="text-primary-600 hover:text-primary-700 font-semibold transition-colors cursor-pointer"
                                    >
                                        {f.name}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-gray-700">{f.location}</td>
                                <td className="px-6 py-4 text-gray-700">{f.treeCount} Trees</td>
                                <td className="px-6 py-4 text-gray-700">{f.members.length} Members</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => {
                                            setSelectedFarmForMember(f.id);
                                            setShowManageMember(true);
                                        }}
                                        className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 ease-in-out hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 hover:shadow-md"
                                    >
                                        Manage Members
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={showAddFarm} onClose={() => setShowAddFarm(false)} title="Add New Farm">
                <div className="space-y-5">
                    <Input
                        label="Farm Name"
                        value={farmName}
                        onChange={(e) => setFarmName(e.target.value)}
                        placeholder="Enter farm name"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                    <Input
                        label="Location"
                        value={farmLocation}
                        onChange={(e) => setFarmLocation(e.target.value)}
                        placeholder="Enter location"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                    <Button onClick={handleAddFarm} className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        Add Farm
                    </Button>
                </div>
            </Modal>

            <Modal isOpen={showManageMember} onClose={() => setShowManageMember(false)} title={`Manage ${farm?.name} Members`}>
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">New Member:</label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={memberEmail}
                                onChange={(e) => setMemberEmail(e.target.value)}
                                placeholder="abc@gmail.com"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            />
                            <Button
                                onClick={handleAddMember}
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Add
                            </Button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold mb-3 text-gray-700">Current Members:</h3>
                        <div className="space-y-2">
                            {farm?.members.map((m) => (
                                <div key={m.email} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <span className="text-sm font-medium text-gray-900">{m.email}</span>
                                    <div className="flex items-center gap-2">
                                        {m.role === 'owner' ? (
                                            <span className="text-xs font-semibold text-primary-600 bg-primary-100 px-3 py-1 rounded-full">
                                                Owner
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => selectedFarmForMember && removeMember(selectedFarmForMember, m.email)}
                                                className="text-red-500 hover:text-red-700 transition-colors p-2 cursor-pointer"
                                                title="Remove member"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
