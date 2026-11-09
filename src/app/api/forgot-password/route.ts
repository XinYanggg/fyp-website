import clientPromise from "@/lib/mongodb";
import {v4 as uuidv4} from "uuid";
import nodemailer from "nodemailer";
import {NextResponse} from "next/server";
import { Resend } from "resend";

/**
 * POST /api/forgot-password
 * 
 * Initiates the password reset process:
 * 1. Verifies the email exists and is verified.
 * 2. Generates a reset token (valid for 15 mins).
 * 3. Sends a reset link via email.
 */

const resend = new Resend(process.env.SMTP_TOKEN);

export async function POST(req: Request) {
    const {email} = await req.json();
    const client = await clientPromise;
    const db = client.db("auth");

    // Check if email is provided
    if (!email) {
        console.log("email is required")
        return NextResponse.json({error: "Email is required"}, {status: 400});
    }

    const user = await db.collection("users").findOne({email});
    if (!user) {
        console.log("user no found")
        return NextResponse.json({error: "User not found"}, {status: 404});
    }

    if (!user.isVerified) {
        return NextResponse.json({error: "Your email is not verified. Please check your email."}, {status: 404});
    }

    const token = uuidv4();
    const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes expiry

    await db.collection("passwordResets").insertOne({
        userId: user._id,
        token,
        expires,
    });

    const resetLink = `${process.env.NEXT_APP_URL}/auth/reset-password?token=${token}`;

    // send email
    await resend.emails.send({
    from: 'durian.health <durian.health@farnxinyang.com>',
    to: [email],
    subject: 'durian.health - Reset your password',
    html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 40px 0;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden;">
                <div style="background-color: #22c55e; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">durian.health</h1>
                </div>
                <div style="padding: 40px 30px;">
                    <h2 style="color: #111827; font-size: 24px; margin-top: 0; margin-bottom: 20px;">Reset Your Password</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                        Hi there,
                    </p>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                        We received a request to reset your password. If you didn't make this request, ignore this email.
                    </p>
                    <div style="text-align: center; margin-bottom: 30px;">
                        <a href="${resetLink}" style="display: inline-block; background-color: #22c55e; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; transition: background-color 0.2s;">
                            Reset Password
                        </a>
                    </div>
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-bottom: 0;">
                        This link will expire in 15 minutes.
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

    return NextResponse.json({ message: "Reset email sent" }, { status: 201 });
}
