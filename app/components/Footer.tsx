/**
 * @fileoverview
 * This file contains the main footer component for the application.
 * It renders at the bottom of every page via the RootLayout.
 */

import { JSX } from "react";
import { Text } from "./Text";

/**
 * The main application footer.
 *
 * It displays:
 * 1. The application title (using `Text` component).
 * 2. The copyright notice (using `Text` component).
 * 3. Links to Terms of Service and Privacy Policy (using `Text` component).
 *
 * @returns {JSX.Element} A <footer> element.
 */
export default function Footer(): JSX.Element {
  return (
    <footer className="bg-footer text-black font-main px-6 py-6">
      <div className="max-w-9xl mx-auto flex flex-col items-start gap-1">
        <h2 className="text-2xl font-bold">
          <Text path="title" />
        </h2>
        <p className="text-sm">
          <Text path="footer.copyright" />
        </p>
        <div className="flex flex-col gap-0 text-sm">
          <a href="#" className="hover:underline">
            <Text path="footer.terms" />
          </a>
          <a href="#" className="hover:underline">
            <Text path="footer.privacy" />
          </a>
        </div>
      </div>
    </footer>
  );
}
