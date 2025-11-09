/**
 * @fileoverview
 * Constant values used in the BookingCard component.
 *
 * This includes:
 * - Available time slots (morning & night)
 * - List of court identifiers
 */

/**
 * List of available morning time slots.
 *
 * @type {string[]}
 */
export const timesMorning = [
  "06:00 - 07:00",
  "07:00 - 08:00",
  "08.00 - 09.00",
  "09.00 - 10.00",
  "10.00 - 11.00",
  "11.00 - 12.00",
  "12.00 - 13.00",
  "13.00 - 14.00",
  "14.00 - 15.00",
  "15.00 - 16.00",
  "16.00 - 17.00",
  "17.00 - 18.00",
];

/**
 * List of available night time slots.
 *
 * @type {string[]}
 */
export const timesNight = [
  "18.00 - 21.00",
  "21.00 - 24.00",
  "24.00 - 03.00",
  "03.00 - 06.00",
];

/**
 * List of court identifiers (as strings).
 *
 * @type {string[]}
 */
export const courts = ["1", "2", "3", "4", "5", "6"];
