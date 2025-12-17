'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';
import {motion} from "framer-motion";
import Link from "next/link";

/**
 * Registration Page
 * 
 * Allows new users to sign up.
 * 1. Collects Name, Email, Password.
 * 2. POSTs to /api/register.
 * 3. Handles success/error feedback.
 */
export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        setLoading(false);

        if (res.ok) {
            setSuccess("Signup successful! Redirecting to login...");
            setTimeout(() => router.push("/auth"), 1500);
        } else {
            const data = await res.json();
            setError(data.error || "Something went wrong");
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
                        Get started
                    </h1>
                    <p className="text-center text-gray-600 mb-8">
                        Create a new account
                    </p>

                    <form onSubmit={handleRegister} className="space-y-6">
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />

                        <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                            {loading ? "Creating..." : "Sign Up"}
                        </Button>
                    </form>

                    {error && (
                        <p className="text-red-500 text-sm text-center mt-4">{error}</p>
                    )}
                    {success && (
                        <p className="text-green-600 text-sm text-center mt-4">{success}</p>
                    )}

                    <p className="text-center text-sm text-gray-600 mt-5">
                        Already have an account?{" "}
                        <Link
                            href="/auth"
                            className="text-primary-600 hover:text-green-500 font-semibold transition-colors cursor-pointer"
                        >
                            Sign In Now
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}