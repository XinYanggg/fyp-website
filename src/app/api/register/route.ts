import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import clientPromise from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import { Resend } from 'resend';

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

const resend = new Resend(process.env.SMTP_TOKEN);

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
        await resend.emails.send({
        from: 'Acme <durian.health@farnxinyang.com>',
        to: [email],
        subject: 'durian.health - Verify Your Email',
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 40px 0;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden;">
                    <div style="background-color: #22c55e; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">durian.health</h1>
                    </div>
                    <div style="padding: 40px 30px;">
                        <h2 style="color: #111827; font-size: 24px; margin-top: 0; margin-bottom: 20px;">Verify Your Email Address</h2>
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                            Hi there,
                        </p>
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                            Thanks for signing up for durian.health! We're excited to have you on board. Please verify your email address to get started.
                        </p>
                        <div style="text-align: center; margin-bottom: 30px;">
                            <a href="${verificationLink}" style="display: inline-block; background-color: #22c55e; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; transition: background-color 0.2s;">
                                Verify Email
                            </a>
                        </div>
                        <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-bottom: 0;">
                            If you didn't create an account, you can safely ignore this email.
                        </p>
                    </div>
                    <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                            &copy; ${new Date().getFullYear()} durian.health. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
            `,
        });

        return NextResponse.json({ message: "Signup successful! Please check your email to verify your account" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to send verification email. Please try again later." }, { status: 500 });
    }
}
