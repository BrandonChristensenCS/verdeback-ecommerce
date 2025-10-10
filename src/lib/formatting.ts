// © 2025 Brandon Christensen. All rights reserved.
// License: Proprietary (no license granted). Do not distribute.

const LOCALE = 'en-US';
const CURRENCY = 'USD';

/**
 * Formats a number as currency.
 * @param value - The numeric value to format.
 * @returns Formatted currency string.
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
  }).format(value);
}

/**
 * Formats a number with default locale.
 * @param value - The numeric value to format.
 * @returns Formatted number string.
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat(LOCALE).format(value);
}

/**
 * Collator for text comparison and sorting, case-insensitive.
 */
export const collator = new Intl.Collator(LOCALE, {
  sensitivity: 'base',
});

/**
 * Compares two strings for sorting, case-insensitive.
 * @param a - First string.
 * @param b - Second string.
 * @returns Comparison result.
 */
export function compareStrings(a: string, b: string): number {
  return collator.compare(a, b);
}

/**
 * Clamps a title to a given maximum length, adding an ellipsis if needed.
 * @param title - The title string to clamp.
 * @param max - Maximum length before clamping (default 80).
 * @returns Possibly-clamped title.
 */
export function clampTitle(title: string, max = 80): string {
  let result: string;
  if (title.length <= max) {
    result = title;
  } else {
    result = `${title.slice(0, Math.max(0, max - 1))}…`;
  }

  return result;
}