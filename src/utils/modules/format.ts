/**
 * Formatting utilities for dates, numbers, strings
 */

/** Format date string "YYYY-MM-DD" → "MM/DD" */
export function formatDateShort(dateStr: string): string {
  return dateStr.slice(5).replace('-', '/');
}

/** Format number to Korean currency string */
export function formatKRW(amount: number): string {
  return `${amount.toLocaleString()}원`;
}

/** Format confidence (0–1) to percentage string */
export function formatConfidence(confidence: number): string {
  return `${(confidence * 100).toFixed(1)}%`;
}

/** Get confidence color class */
export function getConfidenceColor(confidence: number): string {
  return confidence >= 0.9 ? 'text-green' : 'text-amber';
}
