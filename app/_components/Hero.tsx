/**
 * @fileoverview
 * This file contains the Hero section component for the homepage.
 * It is the main "above-the-fold" content that users see first.
 */

import { Text } from "../components/Text";
import Image from "next/image";
import HeroImage from "../assets/images/hero.png";
import ClockIcon from "../assets/icons/clock.svg";
import LocationIcon from "../assets/icons/location.svg";
import MessageIcon from "../assets/icons/chat.svg";
import BookIcon from "../assets/icons/book.svg";
import { JSX } from "react";

/**
 * The Hero section component for the homepage.
 *
 * It displays:
 * 1. The main site title (`<Text path="title" />`).
 * 2. Key information with icons (hours, location, contact).
 * 3. A main call-to-action (CTA) button (`<Text path="hero.button" />`).
 * 4. A large promotional image (`HeroImage`).
 *
 * @returns {JSX.Element} A `div` element structured as the hero section.
 */
export default function Hero(): JSX.Element {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between w-full p-12 sm:p-24 py-24 h-screen">
      <div className="flex flex-col gap-6 h-2/3 sm:justify-between items-start">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl">
            <Text path="title" />
          </h1>
          <p className="flex flex-row gap-2">
            <Image src={ClockIcon} width={25} height={25} alt="Clock Icon" />
            <Text path="hero.clock" />
          </p>
          <p className="flex flex-row gap-2">
            <Image
              src={LocationIcon}
              width={25}
              height={25}
              alt="Location Icon"
            />
            <Text path="hero.location" />
          </p>
          <p className="flex flex-row gap-2">
            <Image
              src={MessageIcon}
              width={25}
              height={25}
              alt="Message Icon"
            />
            +62 85727159265
          </p>
        </div>
        <button className="flex flex-row gap-2 p-3 border rounded-full cursor-pointer">
          <Image src={BookIcon} width={25} height={25} alt="Book Icon" />
          <Text path="hero.button" />
        </button>
      </div>
      <div className="bg-secondary w-fit h-fit p-4 rounded-2xl">
        <Image
          src={HeroImage}
          width={400}
          height={400}
          alt="Hero Image"
          className="sm:w-full sm:h-full"
        />
      </div>
    </div>
  );
}