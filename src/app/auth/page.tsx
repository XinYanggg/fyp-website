// 'use client';
//
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useApp } from '@/app/context/AppContext';
// import Input from '@/app/components/ui/Input';
// import Button from '@/app/components/ui/Button';
// import {motion} from "framer-motion";
//
// export default function LoginPage() {
//     const router = useRouter();
//     const { login } = useApp();
//     const [isLogin, setIsLogin] = useState(true);
//
//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         login();
//         router.push('/dashboard');
//     };
//
//     return (
//         <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-orange-50 flex items-center justify-center p-4">
//             <motion.div
//                 initial={{opacity: 0, y: 20}}
//                 animate={{opacity: 1, y: 0}}
//                 transition={{duration: 0.8}}
//                 className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20"
//             >
//             <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                     {isLogin ? 'Welcome back' : 'Get started'}
//                 </h1>
//                 <p className="text-center text-gray-600 mb-8">
//                     {isLogin ? 'Sign in to your account' : 'Create a new account'}
//                 </p>
//
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     {!isLogin && (
//                         <>
//                             <Input
//                                 label="First Name"
//                                 placeholder="First Name"
//                                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
//                             />
//                             <Input
//                                 label="Last Name"
//                                 placeholder="Last Name"
//                                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
//                             />
//                         </>
//                     )}
//
//                     <Input
//                         label={isLogin ? 'Email' : 'Email Address'}
//                         type="email"
//                         className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
//                         placeholder="abc@gmail.com"
//                         required
//                     />
//
//                     <div>
//                         <Input
//                             label="Password"
//                             type="password"
//                             className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
//                             placeholder="••••••••"
//                             required
//                         />
//                     </div>
//
//                     <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
//                         {isLogin ? 'Sign In' : 'Sign Up'}
//                     </Button>
//                 </form>
//
//                 <p className="text-center text-sm text-gray-600 mt-5">
//                     {isLogin ? "Don't have an account? " : 'Have an account? '}
//                     <button
//                         onClick={() => setIsLogin(!isLogin)}
//                         className="text-primary-600 hover:text-green-500 font-semibold transition-colors cursor-pointer"
//                     >
//                         {isLogin ? 'Sign Up Now' : 'Sign In Now'}
//                     </button>
//                 </p>
//             </div>
//             </motion.div>
//         </div>
//     );
// }





// "use client";
//
// import { signIn } from "next-auth/react";
// import { useState } from "react";
//
// export default function AuthPage() {
//     const [loading, setLoading] = useState(false);
//
//     const handleGoogleLogin = async () => {
//         setLoading(true);
//         await signIn("google", { callbackUrl: "/dashboard" });
//         setLoading(false);
//     };
//
//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen">
//             <h1 className="text-3xl font-bold mb-4">Login to Durian AI System</h1>
//             <button
//                 onClick={handleGoogleLogin}
//                 disabled={loading}
//                 className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
//             >
//                 {loading ? "Signing in..." : "Sign in with Google"}
//             </button>
//         </div>
//     );
// }




"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function AuthPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const res = await signIn("credentials", {
            email: form.email,
            password: form.password,
            redirect: false,
            callbackUrl: "/dashboard",
        });

        if (res?.error) {
            setError(res.error);
        } else {
            window.location.href = "/dashboard";
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold mb-4">Login to Durian AI System</h1>

            <form onSubmit={handleLogin} className="flex flex-col w-80 gap-3">
                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="border rounded px-3 py-2"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="border rounded px-3 py-2"
                />
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Sign In
                </button>
            </form>

            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

            <p className="mt-3 text-sm text-gray-600">
                Don’t have an account?{" "}
                <Link href="/auth/register" className="text-green-600 hover:underline">
                    Register
                </Link>
            </p>

            <div className="mt-4 border-t border-gray-300 w-80 pt-3 text-center">
                <button
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}

