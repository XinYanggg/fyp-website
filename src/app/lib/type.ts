import {ObjectId} from "mongodb";

/**
 * Interface representing a Farm Member.
 */
export interface Member {
    email: string;
    role: "owner" | "member";
}

/**
 * Interface representing a single Disease Scan result.
 */
export interface ScanEntry {
    disease: string;
    confidence: number;
    timestamp: string;
}

/**
 * Interface representing a Tree within a farm.
 */
export interface Tree {
    id: string;
    cultivar: string;
    currentDisease: string;
    confidence: number;
    lastScan: string;
    scans: ScanEntry[];
}

/**
 * Interface representing a Farm document.
 */
export interface Farm {
    _id?: ObjectId;
    ownerEmail: string;
    name: string;
    location: string;
    treeCount: number;
    members: Member[];
    trees: Tree[];
    lastScan: string;
    healthPercentage: string;
}

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}