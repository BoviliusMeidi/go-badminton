/**
 * @fileoverview
 * This file contains the ReviewCard component, a reusable UI card
 * designed to display a single court review image within a carousel.
 */

import { JSX } from "react";
import Image, { StaticImageData } from "next/image";

/**
 * Defines the props accepted by the ReviewCard component.
 */
interface ReviewCardProps {
  /**
   * The image to be displayed. This should be an imported static image
   * (e.g., from `import img from "../assets/image.png"`).
   */
  image: StaticImageData;
  /**
   * The index of the card, used for generating a unique `alt` tag.
   */
  index: number;
}

/**
 * A reusable card component to display a single court review image.
 *
 * This component is optimized for use within a horizontal scroll container:
 * - `shrink-0`: Prevents the card from shrinking in a flex container.
 * - `w-60 h-60` / `sm:w-1/3 sm:h-full`: Defines the responsive size.
 * - `object-cover`: Ensures the image fills the card without distortion.
 *
 * @param {ReviewCardProps} props - The props for the component.
 * @returns {JSX.Element} A `div` element styled as an image card.
 */
export function ReviewCard({ image, index }: ReviewCardProps): JSX.Element {
  return (
    <div
      key={index}
      className="shrink-0 w-60 h-60 sm:w-1/3 sm:h-full bg-main overflow-hidden rounded-2xl transition-shadow duration-300"
    >
      <Image
        src={image}
        alt={`Court Review ${index + 1}`}
        width={400}
        height={400}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
