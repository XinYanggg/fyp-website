import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { encode } from "next-auth/jwt";

/**
 * POST /api/mobile/google
 *
 * Google Sign-In for mobile apps.
 * 1. The app signs in natively with Google and sends the resulting `idToken`.
 * 2. We validate the token with Google (signature, expiry) and check that its
 *    audience is our Google client ID.
 * 3. We find or create the user in the "auth" database (same logic as the
 *    NextAuth Google flow: link to an existing email, mark as verified).
 * 4. We return a NextAuth-compatible JWT, same shape as /api/mobile/login.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const idToken: string | undefined = body?.idToken;

        if (!idToken || typeof idToken !== "string") {
            return NextResponse.json({ error: "Missing Google ID token." }, { status: 400 });
        }

        // Let Google validate the token's signature and expiry.
        const verifyRes = await fetch(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
        );
        if (!verifyRes.ok) {
            return NextResponse.json({ error: "Invalid Google token." }, { status: 401 });
        }
        const info = await verifyRes.json();

        if (info.aud !== process.env.GOOGLE_CLIENT_ID) {
            return NextResponse.json({ error: "Google token audience mismatch." }, { status: 401 });
        }
        if (!info.email || String(info.email_verified) !== "true") {
            return NextResponse.json({ error: "Google email is not verified." }, { status: 401 });
        }

        const email = String(info.email).toLowerCase().trim();
        const client = await clientPromise;
        const db = client.db("auth");

        let user = await db.collection("users").findOne({ email });

        if (!user) {
            const insert = await db.collection("users").insertOne({
                name: info.name || email.split("@")[0],
                email,
                image: info.picture || null,
                isVerified: true,
                emailVerified: new Date(),
            });
            user = await db.collection("users").findOne({ _id: insert.insertedId });
        } else if (!user.isVerified) {
            await db.collection("users").updateOne(
                { _id: user._id },
                { $set: { isVerified: true }, $unset: { verificationToken: "" } }
            );
        }

        if (!user) {
            return NextResponse.json({ error: "Failed to create user." }, { status: 500 });
        }

        // Link the Google account to the user record
        await db.collection("accounts").updateOne(
            { provider: "google", providerAccountId: info.sub },
            {
                $set: {
                    userId: user._id,
                    type: "oauth",
                    provider: "google",
                    providerAccountId: info.sub,
                },
            },
            { upsert: true }
        );

        const token = await encode({
            token: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                picture: user.image || null,
                sub: user._id.toString(),
            },
            secret: process.env.NEXTAUTH_SECRET!,
        });

        return NextResponse.json({
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                image: user.image || null,
            },
        });
    } catch (error) {
        console.error("Mobile Google login error:", error);
        return NextResponse.json(
            { error: "Google sign-in failed. Please try again." },
            { status: 500 }
        );
    }
}
