import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/app/lib/utils';

/**
 * Reusable Input Component
 * 
 * Wraps standard HTMLInputElement with custom styling and optional label.
 * Supports refs for form libraries or direct DOM manipulation.
 */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, className, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'w-full px-4 py-3 border border-gray-300 rounded-lg',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                        'transition-all',
                        className
                    )}
                    {...props}
                />
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;