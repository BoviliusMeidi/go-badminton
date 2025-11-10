"use client";

/**
 * @fileoverview
 * The `BookingCard` component is the main interface for court booking.
 * It allows users to:
 * - Select a booking date
 * - Choose the number of courts
 * - Pick available time slots (morning/night)
 * - Select specific courts
 * - View and confirm total price
 *
 * This component integrates several helper utilities and hooks:
 * - `useBookings` → to sync booked slots with localStorage
 * - `getDayType` and `getPricePerCourt` → to handle price logic
 * - `CourtSelector` and `TimeSelector` → for UI interaction
 * - `bookingStorage` utilities → for persistent storage
 *
 * It automatically prevents double-booking and removes expired bookings.
 */

import { useState, useMemo, useCallback } from "react";
import { Text } from "../Text";
import TimeSelector from "./utils/TimeSelector";
import CourtSelector from "./utils/CourtSelector";
import { getDayType, getPricePerCourt } from "./utils/Counter";
import { useBookings } from "./hooks/useBookings";
import {
  loadBookingsRaw,
  saveBookingsRaw,
  loadBookedSetForDate,
} from "./bookingStorage";
import { startTimeFromLabel } from "./bookingHelpers";
import { timesMorning, timesNight, courts } from "./constants";

type BookingKey = string;
type TimeLabel = string;
type CourtId = string | number;

export default function BookingCard(): JSX.Element {
  const [date, setDate] = useState<string>("");
  const [courtCount, setCourtCount] = useState<number>(1);
  const [selectedTimes, setSelectedTimes] = useState<TimeLabel[]>([]);
  const [selectedCourts, setSelectedCourts] = useState<CourtId[]>([]);
  const { bookedSet, setBookedSet } = useBookings(date);

  /** Handles toggling a selected time slot. */
  const toggleTime = useCallback(
    (time: TimeLabel) => {
      setSelectedTimes((prev) =>
        prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
      );
    },
    []
  );

  /** Checks if a given time/court pair is already booked. */
  const isSlotBooked = useCallback(
    (timeLabel: TimeLabel, courtId: CourtId): boolean => {
      const start = startTimeFromLabel(timeLabel);
      const key: BookingKey = `${start}|${courtId}`;
      return bookedSet.has(key);
    },
    [bookedSet]
  );

  /** Toggles court selection, respecting the court count limit and booked status. */
  const toggleCourt = useCallback(
    (courtId: CourtId) => {
      setSelectedCourts((prev) => {
        if (prev.includes(courtId)) return prev.filter((c) => c !== courtId);
        if (prev.length >= courtCount) return prev;

        for (const t of selectedTimes) {
          if (isSlotBooked(t, courtId)) {
            alert(
              `Lapangan ${courtId} pada ${t} sudah dibooking untuk tanggal ${date}.`
            );
            return prev;
          }
        }
        return [...prev, courtId];
      });
    },
    [courtCount, selectedTimes, date, isSlotBooked]
  );

  /** Determines whether the selected date is weekday or weekend. */
  const dayType = useMemo(() => getDayType(date), [date]);

  /** Calculates total booking cost based on time, court count, and day type. */
  const total = useMemo(() => {
    return selectedTimes.reduce((sum, time) => {
      const perCourt = getPricePerCourt(dayType, time);
      return sum + perCourt * selectedCourts.length;
    }, 0);
  }, [selectedTimes, selectedCourts, dayType]);

  /** Validates and saves booking data to localStorage. */
  const handleSubmit = useCallback(() => {
    if (!date) return alert("Pilih tanggal terlebih dahulu.");
    if (selectedTimes.length === 0 || selectedCourts.length === 0)
      return alert("Pilih jam dan lapangan terlebih dahulu.");

    const raw: Record<string, { key: string; timestamp: number }[]> =
      loadBookingsRaw();
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
    alert("Booking berhasil disimpan!");
  }, [date, selectedTimes, selectedCourts, setBookedSet]);

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
