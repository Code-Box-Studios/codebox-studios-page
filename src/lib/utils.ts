import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Merge conditional class names, de-duplicating conflicting Tailwind utilities.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Two-digit, 1-based label for list indexes (0 -> "01", 9 -> "10").
export const formatIndex = (i: number): string => String(i + 1).padStart(2, '0')
