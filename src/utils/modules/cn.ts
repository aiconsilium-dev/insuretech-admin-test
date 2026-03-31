import { clsx, type ClassValue } from 'clsx';

/**
 * Tailwind class merge helper.
 * Uses clsx for conditional classes.
 * (twMerge not needed since we're on Tailwind v4 which handles conflicts natively)
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(...inputs);
}
