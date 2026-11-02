import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-helper";

/**
 * GET /api/farm/get
 * 
 * Retrieves all farms where the authenticated user is a member.
 * Supports both Web (NextAuth session) and Mobile (Bearer token).
 */
export async function GET(req: Request) {
    const session = await getAuthSession(req);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("durian");

    const email = session.user.email;

    const farms = await db.collection("farms").find({
        "members.email": email
    }).toArray();

    return NextResponse.json({ farms });
}
