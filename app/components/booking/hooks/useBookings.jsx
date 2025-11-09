/**
 * @fileoverview
 * This file defines the custom React hook `useBookings`, responsible for
 * managing the booking state and synchronization logic across components.
 *
 * It handles:
 * - Loading booked courts for a specific date from localStorage.
 * - Cleaning up expired bookings automatically.
 * - Listening to `storage` events for cross-tab synchronization.
 */

import { useEffect, useState, useCallback } from "react";
import { loadBookedSetForDate, cleanupExpiredBookings } from "../bookingStorage";

/**
 * A custom React hook that manages booking data for a selected date.
 *
 * This hook provides real-time synchronization with localStorage, ensuring
 * that bookings are consistent across browser tabs. It automatically cleans
 * expired bookings and updates the internal `bookedSet` state when changes occur.
 *
 * @param {string} date - The selected booking date (e.g., "2025-11-09").
 * @returns {{ bookedSet: Set<string>, setBookedSet: React.Dispatch<React.SetStateAction<Set<string>>> }}
 * An object containing:
 * - `bookedSet`: A Set of booked time slots or courts for the given date.
 * - `setBookedSet`: A setter for updating the booked state manually if needed.
 */
export function useBookings(date) {
  const [bookedSet, setBookedSet] = useState(new Set());

  useEffect(() => {
    if (typeof window !== "undefined" && date) {
      cleanupExpiredBookings();
      setBookedSet(loadBookedSetForDate(date));
    }
  }, [date]);

  useEffect(() => {
    function onStorage(e) {
      if (e.key === "bookings") {
        cleanupExpiredBookings();
        setBookedSet(loadBookedSetForDate(date));
      }
    }
    if (typeof window !== "undefined") {
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    }
  }, [date]);

  return { bookedSet, setBookedSet };
}
