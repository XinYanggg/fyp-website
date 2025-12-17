import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import clientPromise from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

/**
 * POST /api/register
 * 
 * Handles user sign-up:
 * 1. Validates input fields.
 * 2. Checks if user already exists.
 * 3. Hashes the password.
 * 4. Creates a new user record (unverified).
 * 5. Sends an email with a verification link.
 */
export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("auth");

        const existingUser = await db.collection("users").findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a unique email verification token
        const verificationToken = uuidv4();

        // Create the user in the DB (initially unverified)
        await db.collection("users").insertOne({
            name,
            email,
            password: hashedPassword,  // Only for credentials-based users
            isVerified: false,  // Initially set to false
            verificationToken,
            createdAt: new Date(),
        });

        // Create a verification link
        const verificationLink = `${process.env.NEXT_APP_URL}/auth/verify-email?token=${verificationToken}`;

        // Send verification email
        const transporter = nodemailer.createTransport({
            service: "Zoho",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });


        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: "durian.health - Verify Your Email",
            html: `<p>Click <a href="${verificationLink}">here</a> to verify your email and complete your registration.</p>`,
        });

        return NextResponse.json({ message: "Signup successful! Please check your email to verify your account" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to send verification email. Please try again later." }, { status: 500 });
    }
}
