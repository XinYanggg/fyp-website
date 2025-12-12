'use client'

import { useRouter } from 'next/navigation';
import { Search, Plus } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Modal from '@/app/components/ui/Modal';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';
import {Farm} from "@/app/lib/type";

export default function DashboardPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const { farms, setSelectedFarm, addFarm, addMember, removeMember } = useApp();
    const [showAddFarm, setShowAddFarm] = useState(false);
    const [showManageMember, setShowManageMember] = useState(false);
    const [selectedFarmForMember, setSelectedFarmForMember] = useState<string | null>(null);
    const [farmName, setFarmName] = useState('');
    const [farmLocation, setFarmLocation] = useState('');
    const [memberEmail, setMemberEmail] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFarm, setSelectedFarmState] = useState<Farm | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

    // Get farm from farms array when selectedFarmForMember changes
    useEffect(() => {
        const updateSelectedFarm = () => {
            if (selectedFarmForMember) {
                const farm = farms.find(f => f._id?.toString() === selectedFarmForMember);
                setSelectedFarmState(farm || null);
            }
        }
        updateSelectedFarm();
    }, [selectedFarmForMember, farms]);

    const handleAddFarm = () => {
        if (farmName && farmLocation) {
            addFarm(farmName, farmLocation);
            setFarmName('');
            setFarmLocation('');
            setShowAddFarm(false);
        }
    };

    const handleAddMember = async () => {
        if (selectedFarmForMember && memberEmail) {
            const response = await addMember(selectedFarmForMember, memberEmail);
            if (response?.error) {
                setErrorMessage(response.error); // Show error inline
                return;
            }
            setMemberEmail('');
            setErrorMessage('');
        }
    };

    // Check if the user is the owner of the farm
    const isOwner = selectedFarm?.ownerEmail === session?.user?.email;

    // Filter farms based on search term
    const filteredFarms = farms.filter((farm) =>
        farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farm.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-orange-50">
            <div className="max-w-7xl mx-auto py-10 px-6">
                <h1 className="text-4xl font-bold mb-3 text-gray-900">Welcome Back, {session?.user?.name || "Farmer"}!</h1>
                <p className="text-gray-600 mb-10 text-lg">Here&#39;s how your durian trees are doing</p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}  // Update search term
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
                    <div className="overflow-x-auto"> {/* Add this wrapper */}
                        <table className="w-full">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Trees</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Members</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {filteredFarms.map((f) => (
                                <tr key={f._id?.toString()} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => {
                                                setSelectedFarm(f);
                                                router.push(`/farm/${f._id}`);
                                            }}
                                            className="text-primary-600 hover:text-primary-700 font-semibold transition-colors cursor-pointer"
                                        >
                                            {f.name}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">{f.location}</td>
                                    <td className="px-6 py-4 text-gray-700">{f.trees.length} Trees</td>
                                    <td className="px-6 py-4 text-gray-700">{f.members.length} Members</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => {
                                                setSelectedFarmForMember(f._id ? f._id.toString() : null);
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

                {filteredFarms.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🚜</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No farm found</h3>
                        <p className="text-gray-500">Try adjusting your search or create a new farm</p>
                    </div>
                )}

            </div>

            <Modal isOpen={showAddFarm} onClose={() => setShowAddFarm(false)} title="Add New Farm">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAddFarm();
                    }}
                    className="space-y-5"
                >
                    <Input
                        label="Name"
                        value={farmName}
                        onChange={(e) => setFarmName(e.target.value)}
                        placeholder="Enter farm name"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        required
                    />
                    <Input
                        label="Location"
                        value={farmLocation}
                        onChange={(e) => setFarmLocation(e.target.value)}
                        placeholder="Enter location"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        required
                    />
                    <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        Add Farm
                    </Button>
                </form>
            </Modal>

            <Modal isOpen={showManageMember} onClose={() => setShowManageMember(false)} title={`Manage ${selectedFarm?.name} Members`}>
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
                                className={`bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl ${!isOwner ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                disabled={!isOwner}  // Disable button if the user is not the owner
                            >
                                Add
                            </Button>
                        </div>
                        {errorMessage && (
                            <p className="text-red-600 text-sm font-medium mt-1">{errorMessage}</p>
                        )}
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold mb-3 text-gray-700">Current Members:</h3>
                        <div className="space-y-2">
                            {selectedFarm?.members.map((m) => (
                                <div key={m.email} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <span className="text-sm font-medium text-gray-900">{m.email}</span>
                                    <div className="flex items-center gap-2">
                                        {m.role === 'owner' ? (
                                            <span className="text-xs font-semibold text-primary-600 bg-primary-100 px-3 py-1 rounded-full">
                                                Owner
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    if (isOwner) {
                                                        selectedFarmForMember && removeMember(selectedFarmForMember, m.email);
                                                    }
                                                }}
                                                className={`text-red-500 hover:text-red-700 transition-colors p-2 ${!isOwner ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                title="Remove member"
                                                disabled={!isOwner}  // Disable if the user is not the owner
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
