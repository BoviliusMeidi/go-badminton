"use client";
import { useLang } from "@/app/LanguageContext";
import { JSX, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * A custom-built dropdown component to switch the application language.
 *
 * It displays the current language ("ID" or "EN") and reveals
 * a dropdown menu with "Indonesia" and "English" options when clicked.
 *
 * This component uses its own state to manage the dropdown's open/closed status
 * and relies on the `useLang` context to manage the global language state.
 *
 * @returns {JSX.Element} A fixed-position language switcher dropdown.
 */
export default function LangSwitcher(): JSX.Element {
  const { lang, toggleLang } = useLang();
  const [open, setOpen] = useState(false);

  /**
   * Handles the click event on a language option.
   *
   * It calls `toggleLang` only if the selected language is different
   * from the current language, then closes the dropdown.
   *
   * @param {"id" | "en"} newLang - The language selected from the dropdown.
   */
  const handleChange = (newLang: "id" | "en") => {
    // We only toggle if the language is actually different
    if (newLang !== lang) {
      toggleLang();
    }
    setOpen(false); // Always close the dropdown on selection
  };

  return (
    <div className="font-main text-white z-50">
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 py-2 transition-all duration-200 cursor-pointer"
          aria-haspopup="true"
          aria-expanded={open}
        >
          <span className="tracking-wider">{lang === "id" ? "ID" : "EN"}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute right-4 mt-4 w-40 rounded-lg shadow-2xl overflow-hidden animate-fadeIn">
            <button
              onClick={() => handleChange("id")}
              className={`block w-full text-left px-4 py-2 text-sm bg-secondary cursor-pointer ${
                lang === "id" ? "text-main font-bold" : "text-white"
              } hover:bg-opacity-80`}
            >
              Indonesia
            </button>
            <button
              onClick={() => handleChange("en")}
              className={`block w-full text-left px-4 py-2 text-sm bg-secondary cursor-pointer ${
                lang === "en" ? "text-main font-bold" : "text-white"
              } hover:bg-opacity-80`}
            >
              English
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
