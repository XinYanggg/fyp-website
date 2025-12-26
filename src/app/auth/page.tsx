'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';
import {motion} from "framer-motion";

/**
 * Login Page
 * 
 * Handles user authentication via standard credentials (email/password) or Google.
 * Uses NextAuth's `signIn` method.
 */
export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await signIn("credentials", {
            email: form.email,
            password: form.password,
            redirect: false,
        });

        setLoading(false);

        if (res?.error) {
            setError(res.error);
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-orange-50 flex items-center justify-center p-4">
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.8}}
                className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back
                    </h1>
                    <p className="text-center text-gray-600 mb-8">
                        Sign in to your account
                    </p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <Input
                            label="Email"
                            type="email"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) => setForm({...form, email: e.target.value})}
                            required
                        />

                        <div>
                            <Input
                                label="Password"
                                type="password"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) => setForm({...form, password: e.target.value})}
                                required
                            />
                        </div>

                        <Button type="submit" disabled={loading}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    {error && (
                        <p className="text-red-500 text-sm text-center mt-4">{error}</p>
                    )}

                    <p className="text-center text-sm text-gray-600 mt-5">
                        Don’t have an account?{" "}
                        <Link
                            href="/auth/register"
                            className="text-primary-600 hover:text-green-500 font-semibold transition-colors cursor-pointer"
                        >
                            Sign Up Now
                        </Link>
                    </p>

                    <p className="text-center text-sm text-gray-600 mt-5">
                        {" "}
                        <Link
                            href="/auth/forgot-password"
                            className="text-primary-600 hover:text-green-500 font-semibold transition-colors cursor-pointer"
                        >
                            Forgot Password?
                        </Link>
                    </p>

                    <button
                        disabled={loading}
                        onClick={() => signIn("google", {callbackUrl: "/dashboard"})}
                        className="w-full mt-3 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Continue with Google
                    </button>

                </div>
            </motion.div>
        </div>
    );
}
