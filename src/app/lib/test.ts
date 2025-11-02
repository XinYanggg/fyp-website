// Types
interface Farm {
    id: string;
    name: string;
    location: string;
    treeCount: number;
    members: Member[];
    trees: Tree[];
    healthPercentage: number;
    lastScan: string;
}

interface Member {
    email: string;
    role: 'owner' | 'member';
}

interface Tree {
    id: string;
    cultivar: string;
    scans: Scan[];
    currentDisease: string;
    confidence: number;
    lastScan: string;
}

interface Scan {
    disease: string;
    confidence: number;
    timestamp: string;
}

interface User {
    name: string;
    email: string;
}
