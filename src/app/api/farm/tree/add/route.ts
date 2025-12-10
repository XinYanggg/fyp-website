import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import {Farm} from "@/app/lib/type";

export async function POST(req: Request) {
    try {
        const { farmId, treeId, cultivar } = await req.json();

        // Validate input
        if (!farmId || !treeId || !cultivar) {
            return NextResponse.json(
                { error: "Missing fields" },
                { status: 400 }
            );
        }

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

        // Atomic duplicate-check and insert
        const farm = await db.collection<Farm>("farms").findOneAndUpdate(
            {
                _id: new ObjectId(farmId),
                "trees.id": { $ne: treeId },   // Prevent duplicates
            },
            { $push: { trees: tree } },
            { returnDocument: "after" }
        );

        // If no update happened = duplicate tree ID
        if (!farm) {
            return NextResponse.json(
                { error: "Tree ID already exists in this farm" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Tree added successfully", farm: farm },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error adding tree:", error);
        return NextResponse.json(
            { error: "Failed to add tree. Please try again later." },
            { status: 500 }
        );
    }
}
