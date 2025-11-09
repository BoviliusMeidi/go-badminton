/**
 * @fileoverview
 * This file exports utility functions for the booking price calculation logic.
 *
 * It includes two main helpers:
 * 1. `getDayType`: Determines if a date is a "weekday" or "weekend".
 * 2. `getPricePerCourt`: Retrieves the price for a specific time slot,
 * differentiating between weekday/weekend and morning/night rates.
 */

/**
 * Determines if a given date string falls on a weekday or a weekend.
 *
 * - Sunday (0) and Saturday (6) are considered "weekend".
 * - All other days are "weekday".
 * - If the date string is empty/falsy, it defaults to "weekday".
 *
 * @param {string} dateStr - The date string to check (e.g., "2025-11-20").
 * @returns {string} "weekday" or "weekend".
 */
export function getDayType(dateStr: string) {
  if (!dateStr) return "weekday";
  const d = new Date(dateStr);
  const day = d.getDay();
  return day === 0 || day === 6 ? "weekend" : "weekday";
}

/**
 * Calculates the price for a single court time slot.
 *
 * Prices are based on two factors:
 * 1. `dayType`: "weekday" or "weekend".
 * 2. `time`: The specific time slot string.
 *
 * Note: Morning slots (e.g., "08.00-09.00") are priced per hour,
 * while night slots (e.g., "18.00-21.00") are priced as 3-hour packages.
 *
 * @param {string} dayType - The type of day ("weekday" or "weekend").
 * @param {string} time - The time slot string (e.g., "08.00 - 09.00").
 * @returns {number} The price for that single time slot. Returns 0 if not found.
 */
export function getPricePerCourt(dayType: string, time: string) {
  const morning = [
    "08.00 - 09.00",
    "09.00 - 10.00",
    "10.00 - 11.00",
    "11.00 - 12.00",
    "12.00 - 13.00",
    "13.00 - 14.00",
    "14.00 - 15.00",
    "15.00 - 16.00",
    "16.00 - 17.00",
    "17.00 - 18.00",
  ];
  const night = [
    "18.00 - 21.00",
    "21.00 - 24.00",
    "24.00 - 03.00",
    "03.00 - 06.00",
  ];

  if (morning.includes(time)) return dayType === "weekday" ? 50000 : 60000;
  if (night.includes(time)) return dayType === "weekday" ? 180000 : 200000;
  return 0;
}