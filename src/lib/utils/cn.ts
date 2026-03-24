import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging Tailwind classes with clsx.
 * Handles conditional, array, and object class syntaxes,
 * while also resolving Tailwind class conflicts correctly.
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
