/**
 * @fileoverview
 * This file provides helper utilities for handling time slot labels
 * and generating consistent booking keys.
 *
 * Specifically:
 * - `startTimeFromLabel`: Extracts and normalizes the start time
 *   from a time range string (e.g., `"08.00 - 09.00"` → `"08:00"`).
 */

/**
 * Extracts the start time (in `HH:MM` format) from a time slot label.
 *
 * This helper ensures time labels are normalized for comparison
 * and key generation in the booking system.
 *
 * Examples:
 * - `"08.00 - 09.00"` → `"08:00"`
 * - `"24.00 - 03.00"` → `"00:00"`
 *
 * @param {string} label - A time range string (e.g., `"08.00 - 09.00"`).
 * @returns {string} The normalized start time (e.g., `"08:00"`).
 */
export function startTimeFromLabel(label: string): string {
  const start = label.split(" - ")[0].trim();
  const hourMin = start.replace(".", ":");
  if (hourMin.startsWith("24:")) return hourMin.replace("24:", "00:");
  if (hourMin === "24:00") return "00:00";
  return hourMin;
}
