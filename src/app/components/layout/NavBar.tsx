'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Camera, LogIn, Menu, LogOut, BookOpen } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';

export default function NavBar() {
    const router = useRouter();
    const { isLoggedIn, user, logout } = useApp();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40 shadow-sm">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-8">
                    <Link
                        href="/"
                        className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
                    >
                        durian.health
                    </Link>
                </div>

                <div className="hidden md:flex items-center space-x-8">
                    <Link
                        href="/#benefits"
                        className="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2"
                    >
                        Benefits
                    </Link>
                    <Link
                        href="/#works"
                        className="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2"
                    >
                        Works
                    </Link>
                    <Link
                        href="/"
                        className="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2"
                    >
                        Knowledge Base
                    </Link>
                    <Link
                        href="/#about"
                        className="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2"
                    >
                        About
                    </Link>
                    {isLoggedIn && (
                        <Link
                            href="/dashboard"
                            className="text-gray-600 hover:text-green-500 transition-colors font-medium"
                        >
                            Dashboard
                        </Link>
                    )}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    {isLoggedIn ? (
                        <>
                            <Link
                                href="/scan"
                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                            >
                                Quick Scan
                            </Link>
                            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                <div
                                    className="w-10 h-10 bg-amber-200 from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-sm">
                                    <span className="text-black font-semibold">{user?.name[0]}</span>
                                </div>
                                <span className="text-gray-700 font-medium">{user?.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5 cursor-pointer"/>
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/auth"
                            className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                        >
                            Login
                        </Link>
                    )}
                </div>

                <button
                    className="md:hidden p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <Menu className="w-6 h-6"/>
                </button>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden mt-4 pb-4 border-t pt-4">
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded transition-colors"
                        >
                            Knowledge Base
                        </Link>
                        {isLoggedIn && (
                            <>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/scan"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-left px-4 py-2 bg-primary-500 text-white rounded transition-colors"
                                >
                                    Quick Scan
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                        {!isLoggedIn && (
                            <Link
                                href="/auth"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-left px-4 py-2 bg-primary-500 text-white rounded transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}