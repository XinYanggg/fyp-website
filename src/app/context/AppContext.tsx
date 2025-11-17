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

interface AppContextType {
    farms: Farm[];
    selectedFarm: Farm | null;
    selectedTree: Tree | null;

    refreshFarms: () => Promise<void>;

    setSelectedFarm: (farm: Farm | null) => void;
    setSelectedTree: (tree: Tree | null) => void;

    addFarm: (name: string, location: string) => Promise<void>;
    addTree: (farmId: string, treeId: string, cultivar: string) => Promise<void>;
    addMember: (farmId: string, email: string) => Promise<void>;
    removeMember: (farmId: string, email: string) => Promise<void>;
    saveScan: (
        farmId: string,
        treeId: string,
        disease: string,
        confidence: number
    ) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();

    const [farms, setFarms] = useState<Farm[]>([]);
    const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
    const [selectedTree, setSelectedTree] = useState<Tree | null>(null);

    // ------------------------------------------------------------
    // Load farms from API when session becomes authenticated
    // ------------------------------------------------------------
    const refreshFarms = async () => {
        try {
            const res = await fetch("/api/farm/get");
            const data = await res.json();
            setFarms(data.farms || []);
        } catch (err) {
            console.error("Failed to load farms:", err);
        }
    };

    // load farms only when user is signed in
    useEffect(() => {
        const refreshFarms = async () => {
            try {
                const res = await fetch("/api/farm/get");
                const data = await res.json();
                setFarms(data.farms || []);
                console.log(data);
            } catch (err) {
                console.error("Failed to load farms:", err);
            }
        };
        if (status === "authenticated") {
            refreshFarms();
        }
    }, [status]);

    // ------------------------------------------------------------
    // API WRAPPERS
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
            await fetch("/api/farm/tree/add", {
                method: "POST",
                body: JSON.stringify({ farmId, treeId, cultivar }),
            });
            await refreshFarms();
        } catch (err) {
            console.error("Error adding tree:", err);
        }
    };

    const addMember = async (farmId: string, email: string) => {
        try {
            await fetch("/api/farm/member/add", {
                method: "POST",
                body: JSON.stringify({ farmId, email }),
            });
            await refreshFarms();
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
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used inside <AppProvider>");
    }
    return context;
}
