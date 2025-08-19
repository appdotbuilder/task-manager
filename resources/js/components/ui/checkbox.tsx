import React from 'react';
import { cn } from '@/lib/utils';

export function Checkbox({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            type="checkbox"
            className={cn(
                'h-4 w-4 shrink-0 rounded-sm border border-gray-200 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300',
                className
            )}
            {...props}
        />
    );
}