import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

/**
 * POST /api/farm/add
 * 
 * Creates a new farm for the authenticated user.
 * 1. Checks for authentication.
 * 2. Initializes farm with owner and empty tree list.
 * 3. Saves to MongoDB.
 */
export async function POST(req: Request) {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, location } = await req.json();
    const client = await clientPromise;
    const db = client.db("durian");

    const newFarm = {
        ownerEmail: session.user!.email,
        name,
        location,
        members: [{ email: session.user!.email, role: "owner" }],
        trees: []
    };

    const result = await db.collection("farms").insertOne(newFarm);

    return NextResponse.json({ farm: { ...newFarm, _id: result.insertedId } });
}
