import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import {Farm} from "@/app/lib/type";

export async function POST(req: Request) {
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
