/**
 * @fileoverview
 * This file contains the ReviewCourt section component, which displays
 * a horizontally scrollable carousel of court review images.
 * It uses a custom hook `useDragScroll` to enable drag-to-scroll.
 */

"use client";

import { JSX, useRef } from "react";
import { Text } from "../components/Text";
import ReviewOne from "../assets/images/review-1.png";
import ReviewTwo from "../assets/images/review-2.png";
import ReviewThree from "../assets/images/review-3.png";
import { useDragScroll } from "../hooks/useDragScroll";
import { ReviewCard } from "../components/ui/ReviewCard";

/**
 * A section component for the homepage that displays a horizontally
 * draggable carousel of court review images.
 *
 * It features:
 * - A title and description (internationalized via `Text` component).
 * - A scrollable container (`overflow-x-auto`).
 * - Drag-to-scroll functionality provided by the `useDragScroll` hook.
 * - A list of `ReviewCard` components rendered from an image array.
 *
 * @returns {JSX.Element} A `<section>` element containing the review carousel.
 */
export default function ReviewCourt(): JSX.Element {
  /**
   * An array of imported static images to be displayed in the carousel.
   */
  const images = [ReviewOne, ReviewTwo, ReviewThree];

  /**
   * A React ref attached to the scrollable container.
   * This is passed to the `useDragScroll` hook.
   * @type {React.RefObject<HTMLDivElement>}
   */
  const scrollRef = useRef<HTMLDivElement>(null);

  /**
   * Destructured event handlers from the `useDragScroll` hook.
   * These are applied to the scrollable container to enable drag functionality.
   */
  const { handleMouseDown, handleMouseMove, handleMouseLeaveOrUp } =
    useDragScroll(scrollRef);

  return (
    <section id="about" className="w-full flex flex-col gap-12 px-6 sm:px-24 py-24 h-screen font-main">
      <div>
        <h1 className="text-4xl font-bold">
          <Text path="review.title" />
        </h1>
        <p className="text-lg text-gray-700">
          <Text path="review.description" />
        </p>
      </div>
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        className="w-full bg-main p-8 sm:p-16 rounded-2xl overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none"
      >
        <div className="flex gap-6 sm:gap-16 min-w-max sm:pr-24">
          {images.map((img, i) => (
            <ReviewCard key={i} image={img} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}