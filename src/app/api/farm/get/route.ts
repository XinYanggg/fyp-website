import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET() {
    const session = await getServerSession();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("durian");

    const email = session.user?.email;

    const farms = await db.collection("farms").find({
        "members.email": email
    }).toArray();

    return NextResponse.json({ farms });
}
