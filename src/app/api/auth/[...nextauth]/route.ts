import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Account, Profile, User } from "next-auth";
import {ObjectId} from "mongodb";

const client = await clientPromise;
const db = client.db("auth");

/**
 * NextAuth.js Configuration
 * 
 * Handles authentication using:
 * 1. Google Provider
 * 2. Credentials Provider (Email/Password)
 * 3. MongoDB Adapter for session persistence
 * 
 * Includes callbacks for account linking and session management.
 */
export const authOptions = {
    adapter: MongoDBAdapter(clientPromise, {
        databaseName: "auth"
    }),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                }
            },
            profile(profile) {
                return {
                    id: profile.sub, // Google's unique user ID
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    // Custom fields here
                    isVerified: true
                };
            },
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Please provide both email and password");
                }

                const user = await db.collection("users").findOne({ email: credentials.email });

                if (!user) {
                    throw new Error("No user found with this email");
                }

                // Check if the user's email is verified
                if (!user.isVerified) {
                    throw new Error("Your email is not verified. Please check your email.");
                }

                // Case: user registered via Google only (no password yet)
                if (!user.password) {
                    throw new Error("This account was created with Google. Please use Google to log in or reset your password.");
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) {
                    throw new Error("Invalid password");
                }

                return { id: user._id.toString(), name: user.name, email: user.email, image: user.image };
            },
        }),
    ],
    session: {
        strategy: "jwt" as const,
    },
    pages: { signIn: "/auth" },
    callbacks: {
        async signIn({ user, account, profile }: {user: User; account: Account | null; profile?: Profile;}) {

            if (account?.provider === "google") {
                const existingUser = await db.collection("users").findOne({ email: user.email });

                if (existingUser) {
                    // Link Google account to existing credentials user
                    await db.collection("accounts").updateOne(
                        { providerAccountId: account.providerAccountId, provider: "google" },
                        {
                            $set: {
                                userId: existingUser._id,
                                type: account.type,
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                                access_token: account.access_token,
                                // refresh_token: account.refresh_token,
                                expires_at: account.expires_at,
                                token_type: account.token_type,
                                scope: account.scope,
                                id_token: account.id_token,
                            },
                        },
                        { upsert: true }
                    );

                    await db.collection("users").updateOne(
                        { _id: new ObjectId(existingUser._id) },
                        { $set: { isVerified: true }, $unset: { verificationToken: "" } }
                    );

                    // Ensure NextAuth uses the existing user record
                    user.id = existingUser._id.toString();
                }
            }
            return true;

        },

        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) session.user.id = token.sub as string;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

