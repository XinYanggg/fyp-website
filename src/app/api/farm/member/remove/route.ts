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
        { _id: new ObjectId(farmId) },
        { $pull: { members: { email } } },
        { returnDocument: "after" }
    );

    return NextResponse.json({ farm: farm });
}
