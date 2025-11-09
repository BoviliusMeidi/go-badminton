/**
 * @fileoverview
 * This file defines the `BookingCard` component, which serves as the
 * primary interactive booking form for the court information page.
 *
 * It manages the entire booking state, including date, court count,
 * selected times, and selected courts. It uses child components
 * `TimeSelector` and `CourtSelector` for UI and calculates the
 * total price based on user selections and business logic from `Counter`.
 *
 * This component is heavily optimized using `useMemo` for calculations
 * and `useCallback` for event handlers.
 */

"use client";

import { useState, useMemo, useCallback } from "react";
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
 * A stateful component that renders the step-by-step booking form.
 *
 * It controls the entire booking process:
 * 1. Step 1: Date selection
 * 2. Step 2: Court count selection
 * 3. Step 3: Time slot selection
 * 4. Step 4: Specific court selection
 * 5. Step 5: Display total price and submit
 *
 * Each step is shown conditionally based on the state of the previous step.
 * It uses `useMemo` to optimize price calculations and `useCallback`
 * to memoize handlers passed to child components.
 *
 * @returns {JSX.Element} The complete booking card form.
 */
export default function BookingCard() {
  const [date, setDate] = useState("");
  const [courtCount, setCourtCount] = useState(1);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedCourts, setSelectedCourts] = useState<string[]>([]);

  const showCourtCount = !!date;
  const showTimeSelection = showCourtCount;
  const showCourtSelection = selectedTimes.length > 0;
  const showTotal = selectedCourts.length > 0;

  const toggleTime = useCallback((time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  }, []);

  const toggleCourt = useCallback(
    (courtId: string) => {
      setSelectedCourts((prev) => {
        if (prev.includes(courtId)) return prev.filter((c) => c !== courtId);
        if (prev.length < courtCount) return [...prev, courtId];
        return prev;
      });
    },
    [courtCount]
  );

  const dayType = useMemo(() => getDayType(date), [date]);

  const total = useMemo(() => {
    return selectedTimes.reduce((sum, time) => {
      const perCourt = getPricePerCourt(dayType, time);
      return sum + perCourt * selectedCourts.length;
    }, 0);
  }, [selectedTimes, selectedCourts, dayType]);

  return (
    <section className="w-full flex flex-col px-6 sm:px-24 py-29 font-main">
      <div className="bg-main p-8 rounded-2xl shadow-md font-main border border-gray-400">
        <h1 className="text-3xl font-bold mb-8">
          <Text path="courtInfo.bookingForm.title" />
        </h1>

        {/* Step 1: Pilih tanggal */}
        <div className="mb-6">
          <label className="font-semibold">
            <Text path="courtInfo.bookingForm.dateLabel" />
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="block w-full mt-2 p-2 bg-white border rounded-md border-gray-400"
          />
        </div>

        {showCourtCount && <hr className="my-6 border-gray-400" />}

        {/* Step 2: Jumlah Lapangan */}
        {showCourtCount && (
          <div className="mb-6">
            <label className="font-semibold">
              <Text path="courtInfo.bookingForm.fieldCount" />
            </label>
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => setCourtCount((c) => Math.max(1, c - 1))}
                className="px-4 py-1 bg-white border rounded-full border-gray-400 text-sm font-medium transition-colors duration-200"
              >
                -
              </button>
              <span>{courtCount}</span>
              <button
                onClick={() => setCourtCount((c) => c + 1)}
                className="px-4 py-1 bg-white border rounded-full border-gray-400 text-sm font-medium transition-colors duration-200"
              >
                +
              </button>
            </div>
          </div>
        )}

        {showTimeSelection && <hr className="my-6 border-gray-400" />}

        {/* Step 3: Pilih Jam */}
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

        {/* Step 4: Pilih Lapangan */}
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
              />
            </div>
          </>
        )}

        {/* Step 5: Total + Button */}
        {showTotal && (
          <>
            <hr className="my-6 border-gray-400" />
            <div className="flex justify-between items-center mb-6">
              <span className="font-semibold text-lg">
                <Text path="courtInfo.bookingForm.total" />
              </span>
              <span className="text-lg">Rp. {total.toLocaleString()}</span>
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full w-full font-semibold">
              <Text path="courtInfo.bookingForm.button" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}