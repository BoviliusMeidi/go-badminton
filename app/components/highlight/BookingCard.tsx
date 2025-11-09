/**
 * @fileoverview
 * This file defines the `BookingCard` component.
 * It manages the full booking flow for selecting date, time slots, and courts.
 *
 * The component provides:
 * 1. Local booking state management using `localStorage`.
 * 2. Validation to prevent double-booking of the same court, date, and time.
 * 3. Dynamic calculation of total cost using `getDayType` and `getPricePerCourt`.
 * 4. A step-by-step interface for choosing date → court count → time slots → courts → confirmation.
 *
 * This component integrates with `TimeSelector` and `CourtSelector` UI subcomponents.
 */

"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import TimeSelector from "./utils/TimeSelector";
import CourtSelector from "./utils/CourtSelector";
import { getDayType, getPricePerCourt } from "./utils/Counter";
import { Text } from "../Text";

const timesMorning = [
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

const timesNight = [
  "18.00 - 21.00",
  "21.00 - 24.00",
  "24.00 - 03.00",
  "03.00 - 06.00",
];

const courts = ["1", "2", "3", "4", "5", "6"];

/**
 * Extracts the start time from a time label string (e.g., `"08.00 - 09.00" → "08:00"`).
 * It also normalizes `"24:00"` into `"00:00"` for consistent internal comparison.
 *
 * @param {string} label - The time label string.
 * @returns {string} The normalized start time in HH:mm format.
 */
function startTimeFromLabel(label: string) {
  const start = label.split(" - ")[0].trim();
  const hourMin = start.replace(".", ":");
  if (hourMin.startsWith("24:")) return hourMin.replace("24:", "00:");
  if (hourMin === "24:00") return "00:00";
  return hourMin;
}

/**
 * Loads all booking data from `localStorage`.
 *
 * Structure example:
 * ```json
 * {
 *   "2025-11-09": ["08:00|1", "18:00|3"]
 * }
 * ```
 *
 * @returns {Record<string, string[]>} Parsed booking data by date.
 */
function loadBookingsRaw() {
  try {
    const raw = localStorage.getItem("bookings");
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("loadBookingsRaw error", e);
    return {};
  }
}

/**
 * Saves booking data back to `localStorage`.
 *
 * @param {Record<string, string[]>} obj - The booking data object to save.
 */
function saveBookingsRaw(obj: Record<string, string[]>) {
  try {
    localStorage.setItem("bookings", JSON.stringify(obj));
  } catch (e) {
    console.error("saveBookingsRaw error", e);
  }
}

/**
 * Loads all booked `(time|court)` pairs for a specific date.
 * Returns them as a `Set` for fast lookup.
 *
 * @param {string} dateStr - The target date in YYYY-MM-DD format.
 * @returns {Set<string>} A set of booked slots for that date.
 */
function loadBookedSetForDate(dateStr: string) {
  if (!dateStr) return new Set<string>();
  const raw = loadBookingsRaw();
  const arr: string[] = raw[dateStr] || [];
  return new Set(arr);
}

/**
 * The main booking form component.
 * Handles date, court, and time selection, as well as total price calculation and validation.
 *
 * @component
 * @returns {JSX.Element} The rendered booking card UI.
 */
export default function BookingCard() {
  // === State Management ===
  const [date, setDate] = useState("");
  const [courtCount, setCourtCount] = useState(1);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedCourts, setSelectedCourts] = useState<string[]>([]);
  const [bookedSet, setBookedSet] = useState<Set<string>>(() =>
    loadBookedSetForDate(new Date().toISOString().slice(0, 10))
  );

  // === Effects: Sync bookings by date ===
  useEffect(() => {
    setBookedSet(loadBookedSetForDate(date));
  }, [date]);

  // Listen for cross-tab booking updates
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "bookings") {
        setBookedSet(loadBookedSetForDate(date));
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [date]);

  // === UI Flow State ===
  const showCourtCount = !!date;
  const showTimeSelection = showCourtCount;
  const showCourtSelection = selectedTimes.length > 0;
  const showTotal = selectedCourts.length > 0;

  // === Logic: Time selection toggle ===
  const toggleTime = useCallback((time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  }, []);

  /**
   * Checks whether a specific (time, court) pair is already booked.
   *
   * @param {string} timeLabel - The selected time label.
   * @param {string} courtId - The court ID.
   * @returns {boolean} True if booked, false otherwise.
   */
  const isSlotBooked = useCallback(
    (timeLabel: string, courtId: string) => {
      const start = startTimeFromLabel(timeLabel);
      const key = `${start}|${courtId}`;
      return bookedSet.has(key);
    },
    [bookedSet]
  );

  /**
   * Handles toggling a court button.
   * Prevents selecting any court that has a conflict with existing bookings
   * for the currently selected date and time.
   *
   * @param {string} courtId - The court ID to toggle.
   */
  const toggleCourt = useCallback(
    (courtId: string) => {
      setSelectedCourts((prev) => {
        if (prev.includes(courtId)) return prev.filter((c) => c !== courtId);
        if (prev.length >= courtCount) return prev;

        // Prevent booking if any selected time is already taken
        for (const t of selectedTimes) {
          if (isSlotBooked(t, courtId)) {
            alert(
              `Lapangan ${courtId} pada ${t} sudah dibooking untuk tanggal ${date}. Pilih lapangan lain.`
            );
            return prev;
          }
        }

        return [...prev, courtId];
      });
    },
    [courtCount, selectedTimes, date, isSlotBooked]
  );

  // === Derived values ===
  const dayType = useMemo(() => getDayType(date), [date]);

  const total = useMemo(() => {
    return selectedTimes.reduce((sum, time) => {
      const perCourt = getPricePerCourt(dayType, time);
      return sum + perCourt * selectedCourts.length;
    }, 0);
  }, [selectedTimes, selectedCourts, dayType]);

  /**
   * Handles submission of a confirmed booking.
   * Performs final conflict checks, writes new bookings into localStorage,
   * and resets local selections on success.
   */
  const handleSubmit = useCallback(() => {
    if (!date) {
      alert("Pilih tanggal terlebih dahulu.");
      return;
    }
    if (selectedTimes.length === 0 || selectedCourts.length === 0) {
      alert("Pilih jam dan lapangan terlebih dahulu.");
      return;
    }

    const raw = loadBookingsRaw();
    const todays = new Set<string>(raw[date] || []);

    // Re-check for conflicts before saving
    for (const t of selectedTimes) {
      const start = startTimeFromLabel(t);
      for (const c of selectedCourts) {
        const key = `${start}|${c}`;
        if (todays.has(key)) {
          alert(
            `Gagal booking. Slot ${t} lapangan ${c} sudah terisi untuk tanggal ${date}.`
          );
          setBookedSet(loadBookedSetForDate(date));
          return;
        }
      }
    }

    // Save new bookings
    for (const t of selectedTimes) {
      const start = startTimeFromLabel(t);
      for (const c of selectedCourts) {
        const key = `${start}|${c}`;
        todays.add(key);
      }
    }

    raw[date] = Array.from(todays);
    saveBookingsRaw(raw);
    setBookedSet(new Set(raw[date]));
    setSelectedTimes([]);
    setSelectedCourts([]);
    alert("Booking berhasil disimpan.");
  }, [date, selectedTimes, selectedCourts]);

  // === Render ===
  return (
    <section className="w-full flex flex-col px-6 sm:px-24 py-29 font-main">
      <div className="bg-main p-8 rounded-2xl shadow-md font-main border border-gray-400">
        <h1 className="text-3xl font-bold mb-8">
          <Text path="courtInfo.bookingForm.title" />
        </h1>

        {/* Step 1: Select Date */}
        <div className="mb-6">
          <label className="font-semibold">
            <Text path="courtInfo.bookingForm.dateLabel" />
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setSelectedTimes([]);
              setSelectedCourts([]);
            }}
            className="block mt-2 p-2 bg-white border rounded-md border-gray-400"
          />
        </div>

        {showCourtCount && <hr className="my-6 border-gray-400" />}

        {/* Step 2: Select Number of Courts */}
        {showCourtCount && (
          <div className="mb-6">
            <label className="font-semibold">
              <Text path="courtInfo.bookingForm.fieldCount" />
            </label>
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => setCourtCount((c) => Math.max(1, c - 1))}
                className="px-4 py-1 bg-white border rounded-full border-gray-400 text-sm font-medium"
              >
                -
              </button>
              <span>{courtCount}</span>
              <button
                onClick={() => setCourtCount((c) => c + 1)}
                className="px-4 py-1 bg-white border rounded-full border-gray-400 text-sm font-medium"
              >
                +
              </button>
            </div>
          </div>
        )}

        {showTimeSelection && <hr className="my-6 border-gray-400" />}

        {/* Step 3: Select Time Slots */}
        {showTimeSelection && (
          <div className="mb-6">
            <p className="font-semibold mb-2">
              <Text path="courtInfo.bookingForm.fieldTimeMorning" />
            </p>
            <TimeSelector
              times={timesMorning}
              selectedTimes={selectedTimes}
              onToggle={toggleTime}
            />
            <p className="font-semibold mt-4 mb-2">
              <Text path="courtInfo.bookingForm.fieldTimeNight" />
            </p>
            <TimeSelector
              times={timesNight}
              selectedTimes={selectedTimes}
              onToggle={toggleTime}
            />
          </div>
        )}

        {/* Step 4: Select Courts */}
        {showCourtSelection && (
          <>
            <hr className="my-6 border-gray-400" />
            <div className="mb-6">
              <label className="font-semibold mb-2 block">
                <Text path="courtInfo.bookingForm.fieldCourt" />
              </label>
              <CourtSelector
                courts={courts}
                selectedCourts={selectedCourts}
                onToggle={toggleCourt}
                limit={courtCount}
                isCourtBooked={(courtId) => {
                  if (!date || selectedTimes.length === 0) return false;
                  return selectedTimes.some((t) => isSlotBooked(t, courtId));
                }}
              />
            </div>
          </>
        )}

        {/* Step 5: Total & Submit */}
        {showTotal && (
          <>
            <hr className="my-6 border-gray-400" />
            <div className="flex justify-between items-center mb-6">
              <span className="font-semibold text-lg">
                <Text path="courtInfo.bookingForm.total" />
              </span>
              <span className="text-lg">Rp. {total.toLocaleString()}</span>
            </div>

            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full w-full font-semibold"
            >
              <Text path="courtInfo.bookingForm.button" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
