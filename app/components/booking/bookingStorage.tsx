/**
 * @fileoverview
 * Utility functions for managing localStorage-based booking data.
 *
 * This module handles:
 * - Reading and writing booking data to `localStorage`
 * - Returning booked slots as Sets for easy lookup
 * - Auto-cleaning expired bookings (older than 2 hours)
 */

const KEY = "bookings";

/**
 * Loads all raw booking data from localStorage.
 *
 * @returns {Object<string, Array<{key: string, timestamp: number}>>}
 *   An object keyed by date strings, each containing an array of booking entries.
 */
export function loadBookingsRaw() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("loadBookingsRaw error", e);
    return {};
  }
}

/**
 * Saves the given booking object into localStorage.
 *
 * @param {Object} obj - The complete booking dataset to store.
 * @returns {void}
 */
export function saveBookingsRaw(obj) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(obj));
  } catch (e) {
    console.error("saveBookingsRaw error", e);
  }
}

/**
 * Returns a Set of booked slot keys for a specific date.
 *
 * Each key follows the format `"HH:MM|courtId"`.
 *
 * @param {string} dateStr - The date string to load bookings for.
 * @returns {Set<string>} A Set of booking keys for that date.
 */
export function loadBookedSetForDate(dateStr) {
  if (typeof window === "undefined" || !dateStr) return new Set();
  const raw = loadBookingsRaw();
  const arr = raw[dateStr] || [];
  return new Set(arr.map((b) => b.key));
}

/**
 * Removes expired bookings from localStorage.
 *
 * A booking is considered expired if it was made more than 2 hours ago.
 *
 * @returns {void}
 */
export function cleanupExpiredBookings() {
  const now = Date.now();
  const data = loadBookingsRaw();
  let changed = false;

  for (const dateKey in data) {
    const bookings = data[dateKey];
    const filtered = bookings.filter(
      (b) => now - (b.timestamp || 0) < 2 * 60 * 60 * 1000
    );
    if (filtered.length !== bookings.length) {
      data[dateKey] = filtered;
      changed = true;
    }
  }

  if (changed) saveBookingsRaw(data);
}
