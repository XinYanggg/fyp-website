import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import { encode } from "next-auth/jwt";

/**
 * POST /api/mobile/login
 * 
 * Direct authentication endpoint for mobile apps (Android/iOS).
 * 1. Validates email & password against MongoDB "users" collection.
 * 2. Checks email verification status.
 * 3. Issues a NextAuth-compatible JWT token so mobile requests can use
 *    "Authorization: Bearer <token>" across all existing API routes.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const email = body?.email?.toLowerCase().trim();
        const password = body?.password;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Please provide both email and password." },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("auth");

        const user = await db.collection("users").findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: "No user found with this email." },
                { status: 401 }
            );
        }

        if (!user.isVerified) {
            return NextResponse.json(
                { error: "Your email is not verified. Please verify your email first." },
                { status: 403 }
            );
        }

        if (!user.password) {
            return NextResponse.json(
                { error: "This account was registered with Google. Please use Google Sign-In or reset your password." },
                { status: 400 }
            );
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid password." },
                { status: 401 }
            );
        }

        // Generate NextAuth-compatible JWE token using NEXTAUTH_SECRET
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
        console.error("Mobile login error:", error);
        return NextResponse.json(
            { error: "Authentication failed. Please try again." },
            { status: 500 }
        );
    }
}

