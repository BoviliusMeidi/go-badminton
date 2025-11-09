/**
 * @fileoverview
 * This file defines the `BookingCard` component, which provides an interactive
 * form for selecting a date, time slots, and courts for badminton bookings.
 * It handles booking storage, expiration cleanup, and cross-tab synchronization
 * using `localStorage`.
 */

"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import TimeSelector from "./utils/TimeSelector";
import CourtSelector from "./utils/CourtSelector";
import { getDayType, getPricePerCourt } from "./utils/Counter";
import { Text } from "../Text";

/**
 * Morning time slot labels.
 * @type {string[]}
 */
const timesMorning = [
  "06:00 - 07:00",
  "07:00 - 08:00",
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

/**
 * Night time slot labels.
 * @type {string[]}
 */
const timesNight = [
  "18.00 - 21.00",
  "21.00 - 24.00",
  "24.00 - 03.00",
  "03.00 - 06.00",
];

/**
 * Available court numbers.
 * @type {string[]}
 */
const courts = ["1", "2", "3", "4", "5", "6"];

/**
 * Extracts and normalizes the start time from a time label.
 * @param {string} label - The time label (e.g. "06:00 - 07:00")
 * @returns {string} Normalized start time in HH:mm format.
 */
function startTimeFromLabel(label) {
  const start = label.split(" - ")[0].trim();
  const hourMin = start.replace(".", ":");
  if (hourMin.startsWith("24:")) return hourMin.replace("24:", "00:");
  if (hourMin === "24:00") return "00:00";
  return hourMin;
}

/**
 * Loads all booking data from localStorage.
 * @returns {Record<string, Array<{ key: string, timestamp: number }>>}
 */
function loadBookingsRaw() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("bookings");
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("loadBookingsRaw error", e);
    return {};
  }
}

/**
 * Saves booking data to localStorage.
 * @param {object} obj - The booking data object to save.
 */
function saveBookingsRaw(obj) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("bookings", JSON.stringify(obj));
  } catch (e) {
    console.error("saveBookingsRaw error", e);
  }
}

/**
 * Returns a Set of booked slot keys for a specific date.
 * @param {string} dateStr - The target date string (YYYY-MM-DD).
 * @returns {Set<string>} A set of booked slot keys for that date.
 */
function loadBookedSetForDate(dateStr) {
  if (typeof window === "undefined" || !dateStr) return new Set();
  const raw = loadBookingsRaw();
  const arr = raw[dateStr] || [];
  return new Set(arr.map((b) => b.key));
}

/**
 * Removes expired bookings older than 2 hours from localStorage.
 */
function cleanupExpiredBookings() {
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

/**
 * Main booking form component.
 * Allows users to select a date, choose time slots and courts,
 * view total cost, and save temporary bookings to localStorage.
 *
 * @returns {JSX.Element} The rendered booking form section.
 */
export default function BookingCard() {
  const [date, setDate] = useState("");
  const [courtCount, setCourtCount] = useState(1);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedCourts, setSelectedCourts] = useState([]);
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

  const toggleTime = useCallback((time) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  }, []);

  const isSlotBooked = useCallback(
    (timeLabel, courtId) => {
      const start = startTimeFromLabel(timeLabel);
      const key = `${start}|${courtId}`;
      return bookedSet.has(key);
    },
    [bookedSet]
  );

  const toggleCourt = useCallback(
    (courtId) => {
      setSelectedCourts((prev) => {
        if (prev.includes(courtId)) return prev.filter((c) => c !== courtId);
        if (prev.length >= courtCount) return prev;

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

  const dayType = useMemo(() => getDayType(date), [date]);

  const total = useMemo(() => {
    return selectedTimes.reduce((sum, time) => {
      const perCourt = getPricePerCourt(dayType, time);
      return sum + perCourt * selectedCourts.length;
    }, 0);
  }, [selectedTimes, selectedCourts, dayType]);

  const handleSubmit = useCallback(() => {
    if (!date) return alert("Pilih tanggal terlebih dahulu.");
    if (selectedTimes.length === 0 || selectedCourts.length === 0)
      return alert("Pilih jam dan lapangan terlebih dahulu.");

    const raw = loadBookingsRaw();
    const todays = raw[date] || [];

    for (const t of selectedTimes) {
      const start = startTimeFromLabel(t);
      for (const c of selectedCourts) {
        const key = `${start}|${c}`;
        if (todays.some((b) => b.key === key)) {
          alert(`Slot ${t} lapangan ${c} sudah terisi untuk tanggal ${date}.`);
          setBookedSet(loadBookedSetForDate(date));
          return;
        }
      }
    }

    const now = Date.now();
    for (const t of selectedTimes) {
      const start = startTimeFromLabel(t);
      for (const c of selectedCourts) {
        todays.push({ key: `${start}|${c}`, timestamp: now });
      }
    }

    raw[date] = todays;
    saveBookingsRaw(raw);
    setBookedSet(loadBookedSetForDate(date));
    setSelectedTimes([]);
    setSelectedCourts([]);
    alert("Booking berhasil disimpan (auto hapus dalam 5 menit).");
  }, [date, selectedTimes, selectedCourts]);

  return (
    <section className="w-full flex flex-col px-6 sm:px-24 py-29 font-main">
      <div className="bg-main p-8 rounded-2xl shadow-md font-main border border-gray-400">
        <h1 className="text-3xl font-bold mb-8">
          <Text path="courtInfo.bookingForm.title" />
        </h1>

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

        {date && (
          <>
            <hr className="my-6 border-gray-400" />

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

            <hr className="my-6 border-gray-400" />

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

            {selectedTimes.length > 0 && (
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
                      return selectedTimes.some((t) =>
                        isSlotBooked(t, courtId)
                      );
                    }}
                  />
                </div>
              </>
            )}

            {selectedCourts.length > 0 && (
              <>
                <hr className="my-6 border-gray-400" />
                <div className="flex justify-between items-center mb-6">
                  <span className="font-semibold text-lg">
                    <Text path="courtInfo.bookingForm.total" />
                  </span>
                  <span className="text-lg">
                    Rp. {total.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full w-full font-semibold"
                >
                  <Text path="courtInfo.bookingForm.button" />
                </button>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
