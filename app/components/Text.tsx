"use client";
import { JSX } from "react";
import { useLang } from "../LanguageContext";
import { translations } from "../lib/translation";

/**
 * A client component that renders translated text based on a dynamic path.
 * It uses the `useLang` hook to determine the current language and fetches
 * the corresponding string from the `translations` object.
 *
 * @param {object} props - The component props.
 * @param {string} props.path - A dot-separated path to the translation string (e.g., "navbar.home").
 * @returns {JSX.Element} A React fragment containing the translated text.
 * If the translation is not found, it logs a warning and renders the path string as a fallback.
 *
 * @example
 * Renders "Beranda" if lang is "id" and "Home" if lang is "en"
 * <Text path="navbar.home" />
 */
export function Text({ path }: { path: string }): JSX.Element {
  const { lang } = useLang();

  const keys = path.split(".");
  let text: unknown = translations[lang];

  // Traverse the translation object using the keys from the path
  for (const k of keys) {
    if (typeof text === "object" && text !== null && k in text) {
      text = (text as Record<string, unknown>)[k];
    } else {
      // Path is invalid or key doesn't exist
      text = undefined;
      break;
    }
  }

  // Fallback if the path does not resolve to a string
  if (typeof text !== "string") {
    console.warn(`Missing translation for "${path}" in ${lang}`);
    return <>{path}</>;
  }

  return <>{text}</>;
}