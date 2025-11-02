'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Farm, Tree, User } from '@/app/lib/types';
import { generateMockScans } from '@/app/lib/utils';

interface AppContextType {
    user: User | null;
    isLoggedIn: boolean;
    farms: Farm[];
    selectedFarm: Farm | null;
    selectedTree: Tree | null;
    login: () => void;
    logout: () => void;
    setSelectedFarm: (farm: Farm | null) => void;
    setSelectedTree: (tree: Tree | null) => void;
    addFarm: (name: string, location: string) => void;
    addTree: (farmId: string, treeId: string, cultivar: string) => void;
    addMember: (farmId: string, email: string) => void;
    removeMember: (farmId: string, email: string) => void;
    saveScan: (farmId: string, treeId: string, disease: string, confidence: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const mockFarms: Farm[] = [
    {
        id: '1',
        name: 'Farm #1',
        location: 'Location A',
        treeCount: 2,
        members: [
            { email: 'bcd@mail.com', role: 'owner' },
            { email: 'cde@mail.com', role: 'member' }
        ],
        trees: [
            {
                id: '1',
                cultivar: 'Musang King',
                currentDisease: 'Healthy',
                confidence: 96,
                lastScan: '14/5/2025 17:00',
                scans: generateMockScans()
            },
            {
                id: '2',
                cultivar: 'D24',
                currentDisease: 'Leaf Spot',
                confidence: 90,
                lastScan: '12/5/2025 18:00',
                scans: generateMockScans()
            }
        ],
        healthPercentage: 80,
        lastScan: '14/5/2025 17:00'
    }
];

export function AppProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [farms, setFarms] = useState<Farm[]>(mockFarms);
    const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
    const [selectedTree, setSelectedTree] = useState<Tree | null>(null);

    const login = () => {
        setUser({ name: 'Alex', email: 'alex@example.com' });
        setIsLoggedIn(true);
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        setSelectedFarm(null);
        setSelectedTree(null);
    };

    const addFarm = (name: string, location: string) => {
        const newFarm: Farm = {
            id: String(farms.length + 1),
            name,
            location,
            treeCount: 0,
            members: [{ email: user?.email || '', role: 'owner' }],
            trees: [],
            healthPercentage: 100,
            lastScan: 'Never'
        };
        setFarms([...farms, newFarm]);
    };

    const addTree = (farmId: string, treeId: string, cultivar: string) => {
        setFarms(farms.map(farm => {
            if (farm.id === farmId) {
                return {
                    ...farm,
                    trees: [...farm.trees, {
                        id: treeId,
                        cultivar,
                        currentDisease: 'Not scanned',
                        confidence: 0,
                        lastScan: 'Never',
                        scans: []
                    }],
                    treeCount: farm.treeCount + 1
                };
            }
            return farm;
        }));
    };

    const addMember = (farmId: string, email: string) => {
        setFarms(farms.map(farm => {
            if (farm.id === farmId) {
                return {
                    ...farm,
                    members: [...farm.members, { email, role: 'member' as const }]
                };
            }
            return farm;
        }));
    };

    const removeMember = (farmId: string, email: string) => {
        setFarms(farms.map(farm => {
            if (farm.id === farmId) {
                return {
                    ...farm,
                    members: farm.members.filter(m => m.email !== email)
                };
            }
            return farm;
        }));
    };

    const saveScan = (farmId: string, treeId: string, disease: string, confidence: number) => {
        setFarms(farms.map(farm => {
            if (farm.id === farmId) {
                return {
                    ...farm,
                    trees: farm.trees.map(tree => {
                        if (tree.id === treeId) {
                            const now = new Date();
                            const newScan = {
                                disease,
                                confidence,
                                timestamp: now.toLocaleString('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }),
                                date: now
                            };
                            return {
                                ...tree,
                                scans: [newScan, ...tree.scans],
                                currentDisease: disease,
                                confidence,
                                lastScan: newScan.timestamp
                            };
                        }
                        return tree;
                    })
                };
            }
            return farm;
        }));
    };

    return (
        <AppContext.Provider value={{
            user,
            isLoggedIn,
            farms,
            selectedFarm,
            selectedTree,
            login,
            logout,
            setSelectedFarm,
            setSelectedTree,
            addFarm,
            addTree,
            addMember,
            removeMember,
            saveScan
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}