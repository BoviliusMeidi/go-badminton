"use client";

import { Text } from "../../../components/Text";

export default function CourtSelector({
  courts,
  selectedCourts,
  onToggle,
  limit,
  isCourtBooked, // ✅ tambahan opsional
}: {
  courts: string[];
  selectedCourts: string[];
  onToggle: (court: string) => void;
  limit: number;
  isCourtBooked?: (court: string) => boolean; // ✅ tambahan opsional
}) {
  return (
    <div className="flex flex-wrap gap-3 mt-2">
      {courts.map((court, index) => {
        const booked = isCourtBooked?.(court); // ✅ cek apakah booked
        const selected = selectedCourts.includes(court);
        const disabled =
          (!selected && selectedCourts.length >= limit) || booked;

        return (
          <button
            key={court}
            onClick={() => !booked && onToggle(court)}
            disabled={disabled}
            className={`w-30 text-center px-5 py-2 rounded-full border border-gray-400 text-sm font-medium transition-colors duration-200 
              ${
                booked
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed" // ✅ tampilkan booked abu
                  : selected
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800"
              } 
              ${
                !selected && selectedCourts.length >= limit && !booked
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
          >
            <Text path={`courtInfo.bookingForm.courts.${index}`} />
          </button>
        );
      })}
    </div>
  );
}
