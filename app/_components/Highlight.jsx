/**
 * @fileoverview
 * This file defines the main `Highlight` page component.
 * It serves as the primary layout container for the booking section.
 *
 * It imports and renders the `LeftSide` (static info) and `BookingCard`
 * (interactive form) components, placing them side-by-side on larger screens.
 */

"use client";

import BookingCard from "../components/highlight/BookingCard";
import LeftSide from "../components/highlight/LeftSide";

/**
 * The main layout component for the highlight/booking page.
 *
 * It arranges the two main child components:
 * 1. `<LeftSide />`: Displays static information (highlights, pricing, policy).
 * 2. `<BookingCard />`: Provides the interactive step-by-step booking form.
 *
 * The layout is responsive, stacking vertically on small screens (`flex-col`)
 * and switching to a horizontal, side-by-side layout on large screens (`lg:flex-row`).
 *
 * @returns {JSX.Element} A `div` element containing the responsive two-column layout.
 */
export default function Highlight() {
  return (
    <div className="flex flex-col lg:flex-row">
      <LeftSide />
      <BookingCard />
    </div>
  );
}