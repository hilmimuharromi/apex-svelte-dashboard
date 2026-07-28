import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely (dedupe conflicting utilities). */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

/** Format number as IDR money string. */
export function money(n: number, currency = 'IDR', locale = 'id-ID'): string {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		maximumFractionDigits: 0
	}).format(n);
}

/** Compact number: 1234 -> 1.2K, 1_200_000 -> 1.2M */
export function compact(n: number, locale = 'en-US'): string {
	return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}

/** Percentage delta formatter with sign. */
export function pct(n: number): string {
	const sign = n > 0 ? '+' : '';
	return `${sign}${n.toFixed(1)}%`;
}
