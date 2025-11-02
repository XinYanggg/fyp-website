import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/app//lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    children: ReactNode;
}

export default function Button({
                                   variant = 'primary',
                                   children,
                                   className,
                                   ...props
                               }: ButtonProps) {
    const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary-500 text-white hover:bg-primary-600',
        secondary: 'bg-gray-500 text-white hover:bg-gray-600',
        outline: 'border-2 border-gray-300 hover:border-primary-500 hover:text-primary-600'
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
}