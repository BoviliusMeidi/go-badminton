/**
 * @fileoverview
 * This file contains the main navigation bar (NavBar) component for the application.
 * It is a client component responsible for rendering the site logo,
 * navigation links, and the language switcher.
 */
"use client";

import { JSX } from "react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { Text } from "./Text";
import Link from "next/link";

/**
 * The main application header and navigation bar.
 *
 * It renders a fixed header with:
 * 1. The site logo (linking to the homepage).
 * 2. A centered list of navigation links (Home, About, Booking)
 * that use the `Text` component for internationalization.
 * 3. The `LanguageSwitcher` component to allow users to change the language.
 *
 * @returns {JSX.Element} A <header> element containing the site navigation.
 */
export default function NavBar(): JSX.Element {
  return (
    <header className="fixed top-0 left-0 w-full bg-navbar text-white font-main shadow-md px-6 z-50">
      <nav className="relative mx-auto flex items-center justify-between py-3">
        <h1 className="text-xl font-bold">
          <Link href="/">Logo</Link>
        </h1>
        <ul className="absolute left-1/2 transform -translate-x-1/2 flex gap-8 text-base sm:text-lg">
          <li>
            <Link href="/">
              <Text path="navbar.home" />
            </Link>
          </li>
          <li>
            <Link href="/about">
              <Text path="navbar.about" />
            </Link>
          </li>
          <li>
            <Link href="/booking">
              <Text path="navbar.booking" />
            </Link>
          </li>
        </ul>
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
