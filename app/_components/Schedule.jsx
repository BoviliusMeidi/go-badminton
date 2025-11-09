/**
 * @fileoverview
 * The `Schedule` component displays the availability of badminton courts
 * for each time slot and date. It visually shows which slots are booked
 * (blue) and which remain available (yellow/orange).
 *
 * It reads booking data from `localStorage`, which is written by the
 * `BookingCard` component, and automatically cleans expired bookings
 * that are older than 1 hour.
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import { Text } from "../components/Text";

/**
 * A React component that renders a court schedule table with time slots,
 * showing which courts are booked or available.
 *
 * Features:
 * - Date selector to view bookings for different days.
 * - Booked slots highlighted in blue; available slots in yellow/orange.
 * - Automatic refresh every 10 seconds and `storage` event sync.
 * - Expired bookings (older than 1 hour) are removed from `localStorage`.
 * - Responsive design with horizontal scrolling for smaller screens.
 *
 * @returns {JSX.Element} A `<section>` element containing the full court schedule.
 */

const timesMorning = [
  "06:00 - 07:00",
  "07:00 - 08:00",
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
];

const timesNight = [
  "18:00 - 21:00",
  "21:00 - 24:00",
  "24:00 - 03:00",
  "03:00 - 06:00",
];

const courts = ["1", "2", "3", "4", "5", "6"];

function slotKeyFromTimeAndCourt(timeLabel, courtId) {
  const start = timeLabel.split(" - ")[0].trim();
  return `${start}|${courtId}`;
}

function loadBookingsForDate(dateStr) {
  if (typeof window === "undefined" || !dateStr) return new Set();

  try {
    const raw = localStorage.getItem("bookings");
    if (!raw) return new Set();

    const parsed = JSON.parse(raw);
    const arr = parsed[dateStr] || [];
    const now = Date.now();

    const valid = arr.filter(
      (item) => now - (item.timestamp || 0) < 60 * 60 * 1000
    );

    if (valid.length !== arr.length) {
      parsed[dateStr] = valid;
      localStorage.setItem("bookings", JSON.stringify(parsed));
    }

    return new Set(valid.map((item) => item.key));
  } catch (e) {
    console.error("Failed to load bookings:", e);
    return new Set();
  }
}

export default function Schedule() {
  const [date, setDate] = useState(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  const [bookedSlots, setBookedSlots] = useState(new Set());

  useEffect(() => {
    setBookedSlots(loadBookingsForDate(date));
  }, [date]);

  useEffect(() => {
    function onStorage(e) {
      if (e.key === "bookings") {
        setBookedSlots(loadBookingsForDate(date));
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("storage", onStorage);
      const interval = setInterval(() => {
        setBookedSlots(loadBookingsForDate(date));
      }, 10000);
      return () => {
        clearInterval(interval);
        window.removeEventListener("storage", onStorage);
      };
    }
  }, [date]);

  const morningRows = useMemo(
    () => timesMorning.map((t) => ({ label: t, rows: courts })),
    []
  );
  const nightRows = useMemo(
    () => timesNight.map((t) => ({ label: t, rows: courts })),
    []
  );

  const isWeekend = useMemo(() => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
  }, [date]);

  const morningPrice = isWeekend ? "Rp. 60.000" : "Rp. 50.000";
  const nightPrice = isWeekend ? "Rp. 200.000" : "Rp. 180.000";

  return (
    <section className="w-full flex flex-col gap-8 px-6 sm:px-24 py-8 font-main">
      {/* Title + description */}
      <div>
        <h1 className="text-4xl font-bold mb-2">
          <Text path="schedule.title" />
        </h1>
        <p className="text-lg text-gray-700">
          <Text path="schedule.description" />
        </p>
      </div>

      {/* Date selector + schedule table */}
      <div className="bg-main p-6 rounded-2xl shadow-md border border-gray-300">
        <div className="ml-1 mb-6 flex items-center gap-6">
          <label className="font-semibold">
            <Text path="courtInfo.bookingForm.dateLabel" />
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 bg-white border rounded-md border-gray-400"
          />
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[780px]">
            {/* Header */}
            <div className="grid grid-cols-[160px_repeat(6,1fr)] gap-3 items-center mb-3">
              <div className="px-3 py-2 rounded-md bg-white border border-gray-300 text-center font-semibold">
                <Text path="schedule.time" />
              </div>
              {courts.map((c) => (
                <div
                  key={c}
                  className="px-3 py-2 rounded-md bg-white border border-gray-300 text-center font-semibold"
                >
                  <Text path="courtInfo.bookingForm.fieldCourt" /> {c}
                </div>
              ))}
            </div>

            {/* Morning section */}
            <div className="mb-2 mt-7">
              <div className="px-5 py-1 rounded-full bg-white border border-gray-300 w-full text-center font-medium">
                <Text path="courtInfo.pricing.weekday.time.0" />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {morningRows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[160px_repeat(6,1fr)] gap-3 items-center"
                >
                  <div className="px-3 py-2 rounded-md bg-white border border-gray-300 text-sm">
                    {row.label}
                  </div>
                  {courts.map((c) => {
                    const key = slotKeyFromTimeAndCourt(row.label, c);
                    const isBooked = bookedSlots.has(key);
                    return (
                      <div
                        key={c}
                        className={`px-3 py-2 rounded-md border flex items-center justify-center text-sm font-medium shadow-sm transition-colors ${
                          isBooked
                            ? "bg-orange-200 text-gray-600 cursor-not-allowed"
                            : "bg-yellow-200 text-gray-800 border-yellow-300"
                        }`}
                      >
                        {morningPrice}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Night section */}
            <div className="mb-2 mt-10">
              <div className="px-3 py-1 rounded-full bg-white border border-gray-300 w-full text-center font-medium">
                <Text path="courtInfo.pricing.weekday.time.1" />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {nightRows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[160px_repeat(6,1fr)] gap-3 items-center"
                >
                  <div className="px-3 py-2 rounded-md bg-white border border-gray-300 text-sm">
                    {row.label}
                  </div>
                  {courts.map((c) => {
                    const key = slotKeyFromTimeAndCourt(row.label, c);
                    const isBooked = bookedSlots.has(key);
                    return (
                      <div
                        key={c}
                        className={`px-3 py-2 rounded-md border flex items-center justify-center text-sm font-medium shadow-sm transition-colors ${
                          isBooked
                            ? "bg-orange-200 text-gray-600 cursor-not-allowed"
                            : "bg-yellow-200 text-gray-800 border-yellow-300"
                        }`}
                      >
                        {nightPrice}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
