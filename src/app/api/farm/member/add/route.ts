import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import {Farm} from "@/app/lib/type";
import {ObjectId} from "mongodb";

export async function POST(req: Request) {
    const { farmId, email } = await req.json();

    const client = await clientPromise;
    const db = client.db("durian");

    console.log("RUNNING POST");

    const farm = await db.collection<Farm>("farms").findOneAndUpdate(
        { _id: new ObjectId(farmId) },
        { $addToSet: { members: { email, role: "member" } } },
        { returnDocument: "after" }
    );

    if (!farm) {
        return NextResponse.json({ error: "Type not found" }, { status: 404 });
    }

    return NextResponse.json({ farm: farm });
}
