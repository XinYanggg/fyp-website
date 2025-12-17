"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

/**
 * Email Verification Page
 * 
 * Automatically triggers email verification on load based on URL token.
 * Displays loading, success, or error states.
 */
export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!token) {
            setError("Invalid verification link.");
            setLoading(false);
            return;
        }

        const verifyEmail = async () => {
            try {
                const res = await fetch(`/api/verify-email?token=${encodeURIComponent(token)}`, {
                    method: "GET",
                });
                const data = await res.json();
                if (res.ok) {
                    setSuccess(data.message || "Your email has been verified successfully!");
                } else {
                    setError(data.message || "Verification failed. Please try again.");
                }
            } catch (err) {
                console.error(err);
                setError("Something went wrong. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-orange-50 flex items-center justify-center p-4">
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.8}}
                className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20"
            >
                {/* Loading State */}
                {loading && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 0.5}}
                    >
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Verifying your email…
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Please wait a moment while we confirm your email.
                        </p>
                        <div className="flex justify-center">
                            <div
                                className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"/>
                        </div>
                    </motion.div>
                )}

                {/* Success State */}
                {!loading && success && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 0.5}}
                    >
                        <h1 className="text-3xl font-bold text-green-600 mb-2">
                            Email Verified!
                        </h1>
                        <p className="text-gray-700 mb-6">{success}</p>
                        <button
                            onClick={() => router.push("/auth")}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            Go to Login
                        </button>
                    </motion.div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 0.5}}
                    >
                        <h1 className="text-3xl font-bold text-red-600 mb-2">
                            Verification Failed
                        </h1>
                        <p className="text-gray-700 mb-6">{error}</p>
                        <button
                            onClick={() => router.push("/auth")}
                            className="w-full bg-gray-600 text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                        >
                            Back to Login
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
