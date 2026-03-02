import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(value);
};

export const formatDate = (date: string | Date | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ru-RU'); // Or use specific locale
};
