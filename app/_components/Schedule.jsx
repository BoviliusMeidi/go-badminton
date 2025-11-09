"use client";

import { useState, useEffect, useMemo } from "react";
import { Text } from "../components/Text"; // kalau pakai i18n, kalau nggak tinggal hapus

// waktu pagi sesuai gambar (06:00 - 18:00)
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

// malam sesuai gambar
const timesNight = [
  "18:00 - 21:00",
  "21:00 - 24:00",
  "24:00 - 03:00",
  "03:00 - 06:00",
];

const courts = ["1", "2", "3", "4", "5", "6"];

/** Harga tampilan (sesuai gambar): pagi 50.000, malam 180.000 */
function getPriceForTimeLabel(label) {
  // gunakan bagian jam awal untuk menilai pagi/malam
  const start = label.split(" - ")[0];
  const hour = parseInt(start.split(":")[0], 10);
  // anggap kalau start >= 18 atau start < 6 -> malam
  if (hour >= 18 || hour < 6) return "Rp. 180.000";
  return "Rp. 50.000";
}

/** helper buat kunci slot yang disimpan di localStorage */
function slotKeyFromTimeAndCourt(timeLabel, courtId) {
  // pakai start jam sebagai key singkat, contoh "06:00|1"
  const start = timeLabel.split(" - ")[0];
  return `${start}|${courtId}`;
}

/** baca booking untuk tanggal tertentu dari localStorage */
function loadBookingsForDate(dateStr) {
  if (!dateStr) return new Set();
  try {
    const raw = localStorage.getItem("bookings");
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    const arr = parsed[dateStr] || [];
    return new Set(arr);
  } catch (e) {
    console.error("failed to load bookings", e);
    return new Set();
  }
}

export default function Schedule() {
  const [date, setDate] = useState(() => {
    // default: hari ini (format yyyy-mm-dd)
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  const [bookedSlots, setBookedSlots] = useState(() =>
    loadBookingsForDate(new Date().toISOString().slice(0, 10))
  );

  // reload bookings setiap kali tanggal berubah (non-interaktif view)
  useEffect(() => {
    setBookedSlots(loadBookingsForDate(date));
  }, [date]);

  // juga watch localStorage perubahan dari tab lain (jika BookingCard di tab lain menulis)
  useEffect(() => {
    function onStorage(e) {
      if (e.key === "bookings") {
        setBookedSlots(loadBookingsForDate(date));
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [date]);

  // convenience: buat array rows dengan label & times
  const morningRows = useMemo(
    () => timesMorning.map((t) => ({ label: t, rows: courts })),
    []
  );
  const nightRows = useMemo(
    () => timesNight.map((t) => ({ label: t, rows: courts })),
    []
  );

  return (
    <section className="w-full flex flex-col gap-8 px-6 sm:px-24 py-8 font-main">
      <div>
        <h1 className="text-4xl font-bold mb-2">
          <Text path="schedule.title">Jadwal Lapangan</Text>
        </h1>
        <p className="text-lg text-gray-700">
          <Text path="schedule.description">
            Pilih tanggal untuk melihat ketersediaan (kuning = tersedia, biru =
            sudah dibooking)
          </Text>
        </p>
      </div>

      <div className="bg-main p-6 rounded-2xl shadow-md border border-gray-300">
        {/* Tanggal */}
        <div className="mb-6 flex items-center gap-4">
          <label className="font-semibold min-w-[120px]">
            <Text path="courtInfo.bookingForm.dateLabel">Pilih Tanggal</Text>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 bg-white border rounded-md border-gray-400"
          />
        </div>

        {/* Header tabel: kolom Jam + Lap 1..6 */}
        <div className="overflow-x-auto">
          <div className="min-w-[780px]">
            <div className="grid grid-cols-[160px_repeat(6,1fr)] gap-3 items-center mb-3">
              <div className="px-3 py-2 rounded-md bg-white border border-gray-300 text-center font-semibold">
                Jam
              </div>
              {courts.map((c) => (
                <div
                  key={c}
                  className="px-3 py-2 rounded-md bg-white border border-gray-300 text-center font-semibold"
                >
                  Lap {c}
                </div>
              ))}
            </div>

            {/* Pagi label */}
            <div className="mb-2">
              <div className="px-3 py-1 rounded-full bg-white border border-gray-300 w-32 text-center font-medium">
                Pagi
              </div>
            </div>

            {/* Baris pagi */}
            <div className="flex flex-col gap-3">
              {morningRows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[160px_repeat(6,1fr)] gap-3 items-center"
                >
                  {/* Jam */}
                  <div className="px-3 py-2 rounded-md bg-white border border-gray-300 text-sm">
                    {row.label}
                  </div>

                  {/* slots */}
                  {courts.map((c) => {
                    const key = slotKeyFromTimeAndCourt(row.label, c);
                    const isBooked = bookedSlots.has(key);
                    return (
                      <div
                        key={c}
                        className={`px-3 py-2 rounded-md border ${
                          isBooked
                            ? "bg-blue-600 text-white border-blue-700"
                            : "bg-yellow-200 text-gray-800 border-yellow-300"
                        } flex items-center justify-center text-sm font-medium shadow-sm`}
                        // non-interactive view: pointer-events none so user can't click
                        style={{ pointerEvents: "none" }}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-sm">
                            {isBooked ? "Rp. 50.000" : "Rp. 50.000"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Ruang antar */}
            <div className="my-4">
              <div className="px-3 py-1 rounded-full bg-white border border-gray-300 w-28 text-center font-medium">
                Malam
              </div>
            </div>

            {/* Baris malam */}
            <div className="flex flex-col gap-3">
              {nightRows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[160px_repeat(6,1fr)] gap-3 items-center"
                >
                  {/* Jam */}
                  <div className="px-3 py-2 rounded-md bg-white border border-gray-300 text-sm">
                    {row.label}
                  </div>

                  {/* slots */}
                  {courts.map((c) => {
                    const key = slotKeyFromTimeAndCourt(row.label, c);
                    const isBooked = bookedSlots.has(key);
                    return (
                      <div
                        key={c}
                        className={`px-3 py-2 rounded-md border ${
                          isBooked
                            ? "bg-blue-600 text-white border-blue-700"
                            : "bg-yellow-200 text-gray-800 border-yellow-300"
                        } flex items-center justify-center text-sm font-medium shadow-sm`}
                        style={{ pointerEvents: "none" }}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-sm">
                            {isBooked ? "Rp. 180.000" : "Rp. 180.000"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-yellow-200 border border-yellow-300" />
                <span className="text-sm">Tersedia</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-600 border border-blue-700" />
                <span className="text-sm">Sudah dibooking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
