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

/** Helper: konversi label jam "08.00 - 09.00" => start "08:00" (string) */
function startTimeFromLabel(label: string) {
  const start = label.split(" - ")[0].trim(); // "08.00"
  const hourMin = start.replace(".", ":"); // "08:00" or "24:00"
  // normalize 24:00 -> 00:00 to keep single representation (optional)
  if (hourMin.startsWith("24:")) return hourMin.replace("24:", "00:");
  if (hourMin === "24:00") return "00:00";
  return hourMin;
}

/** localStorage format helpers:
 * key: "bookings"
 * value: { "2025-11-09": ["08:00|1", "18:00|3", ...], ... }
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

function saveBookingsRaw(obj: Record<string, string[]>) {
  try {
    localStorage.setItem("bookings", JSON.stringify(obj));
    // trigger storage event for other tabs
    // note: writing to localStorage already triggers "storage" in other tabs, not this tab
  } catch (e) {
    console.error("saveBookingsRaw error", e);
  }
}

/** Return Set of booked keys for a date: e.g. "08:00|3" */
function loadBookedSetForDate(dateStr: string) {
  if (!dateStr) return new Set<string>();
  const raw = loadBookingsRaw();
  const arr: string[] = raw[dateStr] || [];
  return new Set(arr);
}

export default function BookingCard() {
  const [date, setDate] = useState("");
  const [courtCount, setCourtCount] = useState(1);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedCourts, setSelectedCourts] = useState<string[]>([]);

  // local cache of booked slots for the selected date
  const [bookedSet, setBookedSet] = useState<Set<string>>(() =>
    loadBookedSetForDate(new Date().toISOString().slice(0, 10))
  );

  // reload bookedSet when date changes
  useEffect(() => {
    setBookedSet(loadBookedSetForDate(date));
  }, [date]);

  // optional: listen to storage events (if someone else books in other tab)
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "bookings") {
        setBookedSet(loadBookedSetForDate(date));
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [date]);

  const showCourtCount = !!date;
  const showTimeSelection = showCourtCount;
  const showCourtSelection = selectedTimes.length > 0;
  const showTotal = selectedCourts.length > 0;

  const toggleTime = useCallback(
    (time: string) => {
      setSelectedTimes((prev) =>
        prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
      );

      // If user deselect time, keep selectedCourts as-is.
      // If user adds a time and some already-selected courts are booked for this time,
      // we will keep those courts selected but prevent submission / further toggles.
      // Alternatively we could auto-unselect conflicting courts — but to avoid changing UI,
      // we just prevent selecting such courts later.
    },
    []
  );

  /**
   * check if a (timeLabel, courtId) is already booked in bookedSet
   */
  const isSlotBooked = useCallback(
    (timeLabel: string, courtId: string) => {
      const start = startTimeFromLabel(timeLabel); // "08:00"
      const key = `${start}|${courtId}`;
      return bookedSet.has(key);
    },
    [bookedSet]
  );

  /**
   * toggleCourt: prevents selecting a court if for ANY selectedTime
   * that (time|court) pair is already booked.
   *
   * Behaviour:
   * - If court already selected => unselect (always allowed)
   * - If court not selected => only add if for all selectedTimes the pair is NOT booked
   *
   * This enforces: you cannot pick a court that collides with existing bookings on that date/times.
   */
  const toggleCourt = useCallback(
    (courtId: string) => {
      setSelectedCourts((prev) => {
        // if already selected -> remove
        if (prev.includes(courtId)) return prev.filter((c) => c !== courtId);

        // else, check capacity limit
        if (prev.length >= courtCount) return prev;

        // check for conflicts with selectedTimes
        for (const t of selectedTimes) {
          if (isSlotBooked(t, courtId)) {
            // conflict -> do not add. Provide quick feedback.
            // keep UI unchanged (per request), but give user an alert
            // (you can replace with a toast in your app)
            alert(
              `Lapangan ${courtId} pada ${t} sudah dibooking untuk tanggal ${date}. Pilih lapangan lain.`
            );
            return prev; // no change
          }
        }

        // no conflicts -> add
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

  /**
   * Submit handler: writes bookings for every (time, court) selected.
   * It re-checks bookedSet to avoid race conditions and writes deduped entries.
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

    // reload raw bookings and bookedSet to be safe
    const raw = loadBookingsRaw();
    const todays = new Set<string>(raw[date] || []);

    // check conflicts again
    for (const t of selectedTimes) {
      const start = startTimeFromLabel(t);
      for (const c of selectedCourts) {
        const key = `${start}|${c}`;
        if (todays.has(key)) {
          alert(
            `Gagal booking. Slot ${t} lapangan ${c} sudah terisi untuk tanggal ${date}.`
          );
          // reload bookedSet state and abort
          setBookedSet(loadBookedSetForDate(date));
          return;
        }
      }
    }

    // no conflicts -> add all keys
    for (const t of selectedTimes) {
      const start = startTimeFromLabel(t);
      for (const c of selectedCourts) {
        const key = `${start}|${c}`;
        todays.add(key);
      }
    }

    raw[date] = Array.from(todays);
    saveBookingsRaw(raw);
    // update local state
    setBookedSet(new Set(raw[date]));

    // optionally reset selections or keep them; here we'll clear selections
    setSelectedTimes([]);
    setSelectedCourts([]);
    alert("Booking berhasil disimpan.");
  }, [date, selectedTimes, selectedCourts]);

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
            onChange={(e) => {
              setDate(e.target.value);
              // reset selections when date changes to avoid accidental cross-date selections
              setSelectedTimes([]);
              setSelectedCourts([]);
              // bookedSet will reload in effect
            }}
            className="block mt-2 p-2 bg-white border rounded-md border-gray-400"
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
                isCourtBooked={(courtId) => {
                  // kalau belum pilih waktu atau tanggal, tidak ada yg di-book
                  if (!date || selectedTimes.length === 0) return false;
                  // kalau salah satu jam terpilih sudah di-book untuk court ini → return true
                  return selectedTimes.some((t) => isSlotBooked(t, courtId));
                }}
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
