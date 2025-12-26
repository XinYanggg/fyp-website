'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from "next/link";

/**
 * Forgot Password Page
 * 
 * Collects user email to send a password reset link.
 * Interacts with /api/forgot-password.
 */
export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!email) {
            setError('Please enter your email address.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Check your email for the password reset link!');
            } else {
                setError(data.error || 'Unable to send reset link.');
            }
        } catch (err) {
            setError('Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
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
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Forgot Password
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Enter your registered email address to receive a password reset link.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            required
                        />
                    </div>

                    {error &&
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    }
                    {success &&
                        <p className="text-green-600 text-sm text-center">{success}</p>
                    }

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-medium text-white transition-all duration-200 shadow-lg hover:shadow-xl ${
                            loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 cursor-pointer'
                        }`}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-5">
                    {" "}
                    <Link
                        href="/auth"
                        className="text-primary-600 hover:text-green-500 font-semibold transition-colors cursor-pointer"
                    >
                        Back to Login
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}