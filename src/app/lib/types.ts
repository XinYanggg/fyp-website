export interface Farm {
    id: string;
    name: string;
    location: string;
    treeCount: number;
    members: Member[];
    trees: Tree[];
    healthPercentage: number;
    lastScan: string;
}

export interface Member {
    email: string;
    role: 'owner' | 'member';
}

export interface Tree {
    id: string;
    cultivar: string;
    scans: Scan[];
    currentDisease: string;
    confidence: number;
    lastScan: string;
}

export interface Scan {
    disease: string;
    confidence: number;
    timestamp: string;
    date: Date;
}

export interface User {
    name: string;
    email: string;
}

export interface ChatMessage {
    role: 'user' | 'ai';
    message: string;
}