import bcrypt from "bcrypt";
import clientPromise from "@/lib/mongodb";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    const { token, password } = await req.json();
    const client = await clientPromise;
    const db = client.db("auth");

    const reset = await db.collection("passwordResets").findOne({ token });
    if (!reset || reset.expires < new Date()) {
        return NextResponse.json({error: "Invalid or expired token"}, {status: 400});
    }

    const hashed = await bcrypt.hash(password, 10);
    await db.collection("users").updateOne(
        { _id: reset.userId },
        { $set: { password: hashed } }
    );

    await db.collection("passwordResets").deleteOne({ token });

    return NextResponse.json({ message: "Password reset successful" }, { status: 201 });
}
