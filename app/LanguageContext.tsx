"use client";

import { createContext, JSX, useContext, useEffect, useState } from "react";
import { Locale } from "@/app/lib/translation";

/**
 * @typedef {"id" | "en"} Locale - Defines the available language codes.
 */

/**
 * @typedef {object} LangContextType
 * @property {Locale} lang - The current active language code.
 * @property {() => void} toggleLang - Function to flip the language (e.g., id -> en).
 * @property {(lang: Locale) => void} setLanguage - Function to set a specific language.
 */
interface LangContextType {
  lang: Locale;
  toggleLang: () => void;
  setLanguage: (lang: Locale) => void; // <-- FUNGSI BARU
}

/**
 * React Context for managing application language.
 * @type {React.Context<LangContextType>}
 */
const LangContext: React.Context<LangContextType> =
  createContext<LangContextType>({
    lang: "id",
    toggleLang: () => {},
    setLanguage: () => {}, // <-- Default untuk fungsi baru
  });

/**
 * Provider component that supplies language state to its children.
 * It initializes language from localStorage and handles state updates.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The child components to render.
 * @returns {JSX.Element}
 */
export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [lang, setLang] = useState<Locale>("id");

  // Load saved language from localStorage on initial client render
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === "en" || saved === "id") setLang(saved);
  }, []);

  /**
   * Toggles the language between 'id' and 'en'.
   */
  const toggleLang = () => {
    const newLang = lang === "id" ? "en" : "id";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  /**
   * Sets the language to a specific locale.
   * @param {Locale} newLang - The language code to set ("id" or "en").
   */
  const setLanguage = (newLang: Locale) => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <LangContext.Provider value={{ lang, toggleLang, setLanguage }}>
      {children}
    </LangContext.Provider>
  );
}

/**
 * Custom hook to easily access the language context.
 * @returns {LangContextType} The language context (lang, toggleLang, setLanguage).
 */
export function useLang(): LangContextType {
  return useContext(LangContext);
}
