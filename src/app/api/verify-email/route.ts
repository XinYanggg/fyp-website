import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const token = url.searchParams.get("token");

        if (!token) {
            return NextResponse.json({ message: "Verification token is required." }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("auth");  // use your DB name
        const users = db.collection("users");

        const record = await users.findOne({ verificationToken: token });
        if (!record) {
            return NextResponse.json({ message: "Invalid or expired verification link." }, { status: 400 });
        }

        // Mark user as verified
        await users.updateOne(
            { _id: new ObjectId(record._id) },
            { $set: { isVerified: true }, $unset: { verificationToken: "" } }
        );

        return NextResponse.json({ message: "Email verified successfully!" }, { status: 200 });

    } catch (error) {
        console.error("Error verifying email:", error);
        return NextResponse.json({ message: "Server error. Please try again later." }, { status: 500 });
    }
}
