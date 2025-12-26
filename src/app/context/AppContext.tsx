"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { Farm, Tree } from "@/app/lib/type";

// ----------------------------------------------------------------------
// Types & Interfaces
// ----------------------------------------------------------------------
interface AppContextType {
    farms: Farm[];
    selectedFarm: Farm | null;
    selectedTree: Tree | null;

    refreshFarms: () => Promise<void>;

    setSelectedFarm: (farm: Farm | null) => void;
    setSelectedTree: (tree: Tree | null) => void;

    /**
     * Creates a new farm with the given name and location.
     */
    addFarm: (name: string, location: string) => Promise<void>;

    /**
     * Adds a tree to a specific farm.
     * @returns Object containing error message if failed, or null/success data.
     */
    addTree: (farmId: string, treeId: string, cultivar: string) => Promise<{ message?: string; error?: string; } | null>;

    /**
     * Invite/Add a member to the farm by email.
     */
    addMember: (farmId: string, email: string) => Promise<{ error:string } | null>;

    /**
     * Remove a member from the farm.
     */
    removeMember: (farmId: string, email: string) => Promise<void>;

    /**
     * Saves a disease scan result to the database.
     */
    saveScan: (
        farmId: string,
        treeId: string,
        disease: string,
        confidence: number
    ) => Promise<void>;

    /**
     * Uploads an image file to the detection API and returns prediction results.
     */
    detectDisease: (file: File) => Promise<{ prediction: string, confidence: number } | null>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * Global application context provider.
 * Manages stats for farms, trees, and scan operations.
 */
export function AppProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();

    const [farms, setFarms] = useState<Farm[]>([]);
    const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
    const [selectedTree, setSelectedTree] = useState<Tree | null>(null);

    // ------------------------------------------------------------
    // Initialize & Load Data
    // ------------------------------------------------------------

    /**
     * Refreshes the list of farms from the backend.
     * Typically called after adding a farm or changing membership.
     */
    const refreshFarms = async () => {
        try {
            const res = await fetch("/api/farm/get");
            const data = await res.json();
            setFarms(data.farms || []);
        } catch (err) {
            console.error("Failed to load farms:", err);
        }
    };

    // Automatically load farms when the user session is authenticated.
    useEffect(() => {
        const refreshFarms = async () => {
            try {
                const res = await fetch("/api/farm/get");
                const data = await res.json();
                setFarms(data.farms || []);
            } catch (err) {
                console.error("Failed to load farms:", err);
            }
        };
        if (status === "authenticated") {
            refreshFarms();
        }
    }, [status]);

    // ------------------------------------------------------------
    // API Wrappers / Actions
    // ------------------------------------------------------------

    const addFarm = async (name: string, location: string) => {
        try {
            await fetch("/api/farm/add", {
                method: "POST",
                body: JSON.stringify({ name, location }),
            });
            await refreshFarms();
        } catch (err) {
            console.error("Error adding farm:", err);
        }
    };

    const addTree = async (farmId: string, treeId: string, cultivar: string) => {
        try {
            const res = await fetch("/api/farm/tree/add", {
                method: "POST",
                body: JSON.stringify({ farmId, treeId, cultivar }),
            });

            const data = await res.json();

            if (res.ok) {
                await refreshFarms();
            }

            return data;
        } catch (err) {
            console.error("Error adding tree:", err);
        }
    };

    const addMember = async (farmId: string, email: string) => {
        try {
            const res = await fetch("/api/farm/member/add", {
                method: "POST",
                body: JSON.stringify({ farmId, email }),
            });

            const data = await res.json();

            if (res.ok && data.farm) {
                await refreshFarms();
            }

            return data;
        } catch (err) {
            console.error("Error adding member:", err);
        }
    };

    const removeMember = async (farmId: string, email: string) => {
        try {
            await fetch("/api/farm/member/remove", {
                method: "POST",
                body: JSON.stringify({ farmId, email }),
            });
            await refreshFarms();
        } catch (err) {
            console.error("Error removing member:", err);
        }
    };

    const saveScan = async (
        farmId: string,
        treeId: string,
        disease: string,
        confidence: number
    ) => {
        try {
            await fetch("/api/scan/save", {
                method: "POST",
                body: JSON.stringify({ farmId, treeId, disease, confidence }),
            });
            await refreshFarms();
        } catch (err) {
            console.error("Error saving scan:", err);
        }
    };

    const detectDisease = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            // Proxies to external Flask/Python API via Next.js API route
            const res = await fetch("api/scan/detect", {
                method: "POST",
                body: formData
            })
            const data = await res.json();
            return data;
        } catch (err) {
            console.error("Error detected:", err);
        }
    }

    return (
        <AppContext.Provider
            value={{
                farms,
                selectedFarm,
                selectedTree,

                refreshFarms,

                setSelectedFarm,
                setSelectedTree,

                addFarm,
                addTree,
                addMember,
                removeMember,
                saveScan,
                detectDisease,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

/**
 * Custom hook to access the AppContext.
 * Must be used within an <AppProvider>.
 */
export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used inside <AppProvider>");
    }
    return context;
}
