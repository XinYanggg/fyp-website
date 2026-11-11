import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import {Farm} from "@/app/lib/type";
import { getAuthSession } from "@/lib/auth-helper";

/**
 * POST /api/farm/member/remove
 * 
 * Removes a member from the farm.
 * 1. Checks for authentication (Web or Mobile).
 * 2. Remove member from the farm.
 */
export async function POST(req: Request) {
    const session = await getAuthSession(req);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { farmId, email } = await req.json();

    const client = await clientPromise;
    const db = client.db("durian");

    const farm = await db.collection<Farm>("farms").findOneAndUpdate(
        // Only the owner can remove members, and the owner can't be removed
        { _id: new ObjectId(farmId), ownerEmail: session.user.email },
        { $pull: { members: { email, role: { $ne: "owner" } } } },
        { returnDocument: "after" }
    );

    if (!farm) {
        return NextResponse.json({ error: "Farm not found or you are not the owner" }, { status: 404 });
    }

    return NextResponse.json({ farm: farm });
}
