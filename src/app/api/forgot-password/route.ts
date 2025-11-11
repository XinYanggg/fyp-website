import clientPromise from "@/lib/mongodb";
import {v4 as uuidv4} from "uuid";
import nodemailer from "nodemailer";
import {NextResponse} from "next/server";

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
        subject: "durian.health - Reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 15 minutes.</p>`,
    });

    return NextResponse.json({ message: "Reset email sent" }, { status: 201 });
}
