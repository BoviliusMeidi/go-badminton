/**
 * @fileoverview
 * This file contains the main Home page component for the application.
 * It serves as the root entry point (`/`) and assembles the different
 * sections of the homepage.
 */

"use client";

import { JSX } from "react";
import Hero from "./_components/Hero";
import ReviewCourt from "./_components/ReviewCourt";
import Highlight from "./_components/Highlight";
import Schedule from "./_components/Schedule";

export default function Home(): JSX.Element {
  return (
    <>
      <Hero />
      <ReviewCourt />
      <Highlight />
      <Schedule />
    </>
  );
}
