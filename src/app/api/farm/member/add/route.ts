import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import {Farm} from "@/app/lib/type";
import {ObjectId} from "mongodb";
import { getServerSession } from "next-auth";

/**
 * POST /api/farm/member/add
 * 
 * Adds a new member to an existing farm.
 * 1. Checks for authentication.
 * 2. Verifies that the user to add exists in the Auth DB.
 * 3. Adds the user to the farm's members list.
 */
export async function POST(req: Request) {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { farmId, email } = await req.json();

    const client = await clientPromise;

    const authDb = client.db("auth");
    const userExists = await authDb.collection("users").findOne({ email });

    if (!userExists) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const durianDb = client.db("durian");
    const farm = await durianDb.collection<Farm>("farms").findOneAndUpdate(
        { _id: new ObjectId(farmId) },
        { $addToSet: { members: { email, role: "member" } } },
        { returnDocument: "after" }
    );

    if (!farm) {
        return NextResponse.json({ error: "Farm not found" }, { status: 404 });
    }

    return NextResponse.json({ farm: farm });
}
