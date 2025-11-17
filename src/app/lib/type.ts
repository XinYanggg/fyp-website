import {ObjectId} from "mongodb";

export interface Member {
    email: string;
    role: "owner" | "member";
}

export interface ScanEntry {
    disease: string;
    confidence: number;
    timestamp: string;
}

export interface Tree {
    id: string;
    cultivar: string;
    currentDisease: string;
    confidence: number;
    lastScan: string;
    scans: ScanEntry[];
}

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