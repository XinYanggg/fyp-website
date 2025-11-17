import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import {Farm} from "@/app/lib/type";

export async function POST(req: Request) {
    const { farmId, email } = await req.json();

    const client = await clientPromise;
    const db = client.db("durian");

    const farm = await db.collection<Farm>("farms").findOneAndUpdate(
        { _id: new ObjectId(farmId) },
        { $pull: { members: { email } } },
        { returnDocument: "after" }
    );

    return NextResponse.json({ farm: farm });
}
