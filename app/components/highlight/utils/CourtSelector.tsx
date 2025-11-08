/**
 * @fileoverview
 * This file defines the `CourtSelector` component.
 * It's a reusable UI component responsible for displaying a grid of
 * available courts (e.g., "Lapangan 1", "Lapangan 2") as buttons.
 *
 * This component is controlled and enforces a selection `limit` based on a
 * prop. It disables unselected buttons when the number of selected courts
 * reaches the limit. It uses the `<Text />` component to fetch localized court labels.
 */

"use client";

import { Text } from "../../../components/Text";

/**
 * A reusable UI component for rendering a grid of selectable court buttons.
 *
 * This component is controlled by its parent. It receives an array of all
 * `courts` (as IDs), an array of `selectedCourts`, an `onToggle` handler,
 * and a `limit` prop.
 *
 * It prevents the user from selecting more courts than the `limit` by
 * disabling other buttons. It uses the `<Text />` component and the button's
 * *index* to render the display text (e.g., "Lapangan 1").
 *
 * @param {object} props - The component's props (see type definition).
 * @param {string[]} props.courts - An array of court IDs (e.g., "1", "2") used for logic and keys.
 * @param {string[]} props.selectedCourts - An array of the IDs of currently selected courts.
 * @param {(court: string) => void} props.onToggle - Callback executed when a court button is clicked.
 * @param {number} props.limit - The maximum number of courts that can be selected.
 * @returns {JSX.Element} A responsive, flex-wrapped grid of court buttons.
 */
export default function CourtSelector({
  courts,
  selectedCourts,
  onToggle,
  limit,
}: {
  courts: string[];
  selectedCourts: string[];
  onToggle: (court: string) => void;
  limit: number;
}) {
  return (
    <div className="flex flex-wrap gap-3 mt-2">
      {courts.map((court, index) => (
        <button
          key={court}
          onClick={() => onToggle(court)}
          disabled={
            !selectedCourts.includes(court) && selectedCourts.length >= limit
          }
          className={`w-30 text-center px-5 py-2 rounded-full border border-gray-400 text-sm font-medium transition-colors duration-200 
            ${
              selectedCourts.includes(court)
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-800"
            } ${
            !selectedCourts.includes(court) && selectedCourts.length >= limit
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <Text path={`courtInfo.bookingForm.courts.${index}`} />
        </button>
      ))}
    </div>
  );
}