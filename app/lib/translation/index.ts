import { id } from "./id";
import { en } from "./en";

/**
 * @fileoverview Main translation object aggregator.
 *
 * This file imports all individual locale objects (e.g., 'id', 'en')
 * and combines them into a single `translations` object.
 *
 * It also exports the `Locale` type, which is dynamically generated
 * from the keys of the `translations` object (e.g., "id" | "en").
 * This ensures that the `Locale` type stays in sync as new
 * languages are added.
 */

/**
 * The main object containing all application translations, keyed by locale.
 *
 * @example
 * {
 * id: { title: "...", hero: { ... } },
 * en: { title: "...", hero: { ... } }
 * }
 * @type {{id: object, en: object}}
 */
export const translations: { id: object; en: object; } = {
  id,
  en,
};

/**
 * Defines the available language codes based on the exported translations.
 *
 * This type is dynamically created from the keys of the `translations` object.
 * If you add `fr` to `translations`, `Locale` will automatically become
 * `"id" | "en" | "fr"`.
 *
 * @example
 * "id" | "en"
 *
 * @typedef {"id" | "en"} Locale
 */
export type Locale = keyof typeof translations;