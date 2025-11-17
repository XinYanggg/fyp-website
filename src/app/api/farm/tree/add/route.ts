import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import {Farm} from "@/app/lib/type";

export async function POST(req: Request) {
    const { farmId, treeId, cultivar } = await req.json();

    const client = await clientPromise;
    const db = client.db("durian");

    const tree = {
        id: treeId,
        cultivar,
        currentDisease: "Healthy",
        confidence: 0,
        lastScan: "N/A",
        scans: []
    };

    const farm = await db.collection<Farm>("farms").findOneAndUpdate(
        { _id: new ObjectId(farmId) },
        { $push: { trees: tree } },
        { returnDocument: "after" }
    );

    return NextResponse.json({ farm: farm });
}
