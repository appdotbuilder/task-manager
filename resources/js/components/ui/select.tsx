import React from 'react';
import { cn } from '@/lib/utils';

interface SelectProps {
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
}

interface SelectTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

interface SelectContentProps {
    children: React.ReactNode;
}

interface SelectItemProps {
    value: string;
    children: React.ReactNode;
}

interface SelectValueProps {
    placeholder?: string;
}

const SelectContext = React.createContext<{
    value?: string;
    onValueChange?: (value: string) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}>({
    isOpen: false,
    setIsOpen: () => {},
});

export function Select({ value, onValueChange, children }: SelectProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen }}>
            <div className="relative">
                {children}
            </div>
        </SelectContext.Provider>
    );
}

export function SelectTrigger({ className, children, ...props }: SelectTriggerProps) {
    const { isOpen, setIsOpen } = React.useContext(SelectContext);

    return (
        <button
            type="button"
            className={cn(
                'flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus:ring-gray-300',
                className
            )}
            onClick={() => setIsOpen(!isOpen)}
            {...props}
        >
            {children}
            <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </button>
    );
}

export function SelectContent({ children }: SelectContentProps) {
    const { isOpen } = React.useContext(SelectContext);

    if (!isOpen) return null;

    return (
        <div className="absolute z-50 w-full mt-1 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-950 shadow-md animate-in fade-in-0 zoom-in-95 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50">
            <div className="p-1">
                {children}
            </div>
        </div>
    );
}

export function SelectItem({ value, children }: SelectItemProps) {
    const { value: selectedValue, onValueChange, setIsOpen } = React.useContext(SelectContext);

    const handleClick = () => {
        onValueChange?.(value);
        setIsOpen(false);
    };

    return (
        <div
            className={cn(
                'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50',
                selectedValue === value && 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
            )}
            onClick={handleClick}
        >
            {children}
        </div>
    );
}

export function SelectValue({ placeholder }: SelectValueProps) {
    const { value } = React.useContext(SelectContext);

    return (
        <span className={cn(value ? 'text-gray-900 dark:text-gray-50' : 'text-gray-500 dark:text-gray-400')}>
            {value || placeholder}
        </span>
    );
}