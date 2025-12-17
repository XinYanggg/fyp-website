'use client';

import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
}

/**
 * Modal Component
 * 
 * Renders a centered dialog with a backdrop.
 * Used for forms like "Add Farm" or "Add Tree".
 */
export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full relative shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                    <X className="w-6 h-6" />
                </button>
                {title && <h2 className="text-2xl font-bold mb-6 text-gray-900">{title}</h2>}
                {children}
            </div>
        </div>
    );
}