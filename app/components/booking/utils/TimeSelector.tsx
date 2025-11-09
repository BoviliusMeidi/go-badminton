/**
 * @fileoverview
 * This file defines the `TimeSelector` component.
 * It's a reusable UI component responsible for displaying a grid of
 * available time slots (e.g., "08.00 - 09.00") as buttons.
 *
 * The component is controlled and visualizes which time slots are
 * selected based on the `selectedTimes` prop. It reports user
 * interactions (clicks) back to the parent via the `onToggle` callback.
 */

"use client";

/**
 * A reusable UI component for rendering a grid of selectable time slots.
 *
 * This component is controlled by its parent. It receives an array of all
 * `times` to display, an array of `selectedTimes` to determine the
 * "active" state, and an `onToggle` handler to report back
 * user clicks.
 *
 * It dynamically maps over the `times` array to create buttons and
 * applies conditional styling based on the `selectedTimes` array.
 *
 * @param {object} props - The component's props (see type definition).
 * @param {string[]} props.times - An array of time slot strings to display.
 * @param {string[]} props.selectedTimes - An array of time slot strings that are currently selected.
 * @param {(time: string) => void} props.onToggle - Callback executed when a time button is clicked.
 * @returns {JSX.Element} A responsive, flex-wrapped grid of time buttons.
 */
export default function TimeSelector({
  times,
  selectedTimes,
  onToggle,
}: {
  times: string[];
  selectedTimes: string[];
  onToggle: (time: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3 mt-2">
      {times.map((time) => (
        <button
          key={time}
          onClick={() => onToggle(time)}
          className={`w-30 text-center px-5 py-2 rounded-full border border-gray-400 text-sm font-medium transition-colors duration-200
            ${
              selectedTimes.includes(time)
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-800 hover:bg-blue-50"
            }`}
        >
          {time}
        </button>
      ))}
    </div>
  );
}