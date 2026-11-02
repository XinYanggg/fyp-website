import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import {Farm} from "@/app/lib/type";
import { getAuthSession } from "@/lib/auth-helper";

/**
 * POST /api/scan/save
 * 
 * Saves a new disease scan result to a tree's history.
 * 1. Checks for authentication (Web or Mobile).
 * 2. Updates the tree's current status and last scan timestamp.
 * 3. Appends the scan result to the history array ("trees.$.scans").
 */
export async function POST(req: Request) {
    const session = await getAuthSession(req);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { farmId, treeId, disease, confidence } = await req.json();

    const timestamp = new Date().toLocaleString();

    const client = await clientPromise;
    const db = client.db("durian");

    const farm = await db.collection<Farm>("farms").findOneAndUpdate(
        {
            _id: new ObjectId(farmId),
            "trees.id": treeId
        },
        {
            $set: {
                "trees.$.currentDisease": disease,
                "trees.$.confidence": confidence,
                "trees.$.lastScan": timestamp
            },
            $push: {
                "trees.$.scans": { disease, confidence, timestamp }
            }
        },
        { returnDocument: "after" }
    );

    return NextResponse.json({ farm: farm });
}
