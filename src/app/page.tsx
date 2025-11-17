'use client';

import Link from 'next/link';
import {motion} from "framer-motion";
import {Upload} from "lucide-react";
import React from "react";
import { useSession } from 'next-auth/react';

export default function HomePage() {
    const { data: session } = useSession();
    const isLoggedIn = session ? true : false;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-orange-50">
            <div className="bg-gradient-to-r from-primary-100 to-primary-50 py-20 px-6">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.8}}
                >
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1">
                            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                Diagnose Durian Tree Health
                            </h1>
                            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                                AI-powered leaf disease detection for Malaysian durian farmers to diagnose issues,
                                get tailored recommendations, and track tree health over time.
                            </p>
                            <div className="flex gap-4">
                                <Link
                                    href={isLoggedIn ? '/scan' : '/auth'}
                                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                                >
                                    Diagnose my tree
                                </Link>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl">
                                <img
                                    src="durianFarm.jpg"
                                    alt="Durian Farm"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                        </div>
                    </div>
                </motion.div>
            </div>

            <section id="benefits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.8, delay: 0.2}}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Why durian.health?</h2>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: '⚡',
                            title: 'Rapid Diagnosis',
                            desc: 'Upload a leaf photo and get a disease label in seconds',
                            color: "from-blue-400 to-blue-600"
                        },
                        {
                            icon: '📱',
                            title: 'Offline & Mobile-Friendly',
                            desc: 'Work in the field even with limited internet',
                            color: "from-yellow-400 to-orange-500"
                        },
                        {
                            icon: '📊',
                            title: 'Track History',
                            desc: 'Monitor disease trends across your farm with analytics',
                            color: "from-green-400 to-green-600"
                        }
                    ].map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.8, delay: 0.4 + index * 0.1}}
                            className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 group hover:-translate-y-2"
                        >
                            <div
                                className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl group-hover:scale-110 transition-transform duration-300`}>
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">{item.title}</h3>
                            <p className="text-gray-600 text-center leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section id="works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.8, delay: 0.6}}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">How it works?</h2>
                </motion.div>

                {/* Flex container for features and image */}
                <div className="flex flex-col md:flex-row gap-12 items-center">

                    {/* Features column */}
                    <div className="flex-1 flex flex-col gap-6">
                        {[
                            {
                                title: "Upload",
                                icon: <Upload className="w-8 h-8 text-white"/>,
                                description: "Take a clear photo of a leaf with your phone",
                                color: "from-green-400 to-green-600",
                            },
                            {
                                title: "Diagnose",
                                icon: (
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V9h7V2.99c3.72 1.15 6.47 4.82 7 8.94h-7v1.06z"/>
                                    </svg>
                                ),
                                description: "Our AI identifies the disease and shows confidence",
                                color: "from-blue-400 to-blue-600",
                            },
                            {
                                title: "Act & Track",
                                icon: (
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
                                    </svg>
                                ),
                                description: "Follow recommended actions and record the result",
                                color: "from-yellow-400 to-yellow-600",
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.8, delay: 0.8 + index * 0.1}}
                                className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 group hover:-translate-y-2"
                            >
                                <div
                                    className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl group-hover:scale-110 transition-transform duration-300`}
                                >
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{feature.title}</h3>
                                <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Image column */}
                    <motion.div
                        className="flex-1 rounded-2xl overflow-hidden shadow-xl"
                        initial={{opacity: 0, x: 20}}
                        whileInView={{opacity: 1, x: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.8}}
                    >
                        <img
                            src="sampleOutput.png"
                            alt="Durian leaf"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>
            </section>

            <section id="about">
                <footer className="bg-gray-900 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
                            <div className="flex items-center justify-center space-x-2 mb-4">
                                <span className="text-l font-bold">Farn Xin Yang | TP074541</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Improving Durian Tree Health. Developed under supervision of Dr. Kulothunkan A/L Palasundram
                            </p>
                        </div>

                        <div className="border-t border-gray-800 pt-8 text-center">
                            <p className="text-gray-400 text-sm">SDG 12: Responsible Consumption and Production</p>
                        </div>
                    </div>
                </footer>
            </section>
        </div>
    );
}
