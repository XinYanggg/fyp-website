"use client";

import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { AppProvider } from '@/app/context/AppContext';
import NavBar from '@/app/components/layout/NavBar';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

/**
 * Client-Side Root Layout
 * 
 * Wraps the application with:
 * 1. SessionProvider (NextAuth)
 * 2. AppProvider (Global State)
 * 3. NavBar
 */
export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {/* Wrap the entire app in SessionProvider */}
                <SessionProvider>
                    <AppProvider>
                        <div className="min-h-screen bg-gray-50">
                            <NavBar />
                            {children}
                        </div>
                    </AppProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
