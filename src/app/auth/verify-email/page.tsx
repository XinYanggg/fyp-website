"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your email…");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid verification link.");
            return;
        }

        const verify = async () => {
            try {
                const res = await fetch(`/api/verify-email?token=${encodeURIComponent(token)}`, {
                    method: "GET",
                });
                const data = await res.json();
                if (res.ok) {
                    setStatus("success");
                    setMessage(data.message || "Your email has been verified!");
                } else {
                    setStatus("error");
                    setMessage(data.message || "Verification failed.");
                }
            } catch (error) {
                console.error(error);
                setStatus("error");
                setMessage("Something went wrong. Please try again later.");
            }
        };

        verify();
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
            <div className="max-w-md w-full bg-white shadow p-6 rounded-lg text-center">
                {status === "loading" && (
                    <>
                        <h1 className="text-2xl font-semibold mb-2">Verifying your email…</h1>
                        <p className="text-gray-600">Please wait a moment.</p>
                    </>
                )}
                {status === "success" && (
                    <>
                        <h1 className="text-2xl font-semibold text-green-600 mb-2">Email Verified!</h1>
                        <p className="text-gray-600 mb-4">{message}</p>
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                            onClick={() => router.push("/auth")}
                        >
                            Go to Login
                        </button>
                    </>
                )}
                {status === "error" && (
                    <>
                        <h1 className="text-2xl font-semibold text-red-600 mb-2">Verification Failed</h1>
                        <p className="text-gray-600 mb-4">{message}</p>
                        <button
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                            onClick={() => router.push("/auth")}
                        >
                            Back to Login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
