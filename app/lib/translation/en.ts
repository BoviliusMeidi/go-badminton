/**
 * @fileoverview English (en) translations for the application.
 *
 * This object contains all the static text strings for the "en" locale.
 * The structure of this object (e.g., 'hero.clock') is used by the
 * <Text> component to dynamically find and render the correct string.
 *
 * @type {object}
 */

export const en: object = {
  title: "Go! Badminton",
  description:
    "An easy and fast badminton court booking platform. Book your favorite court online in just a few clicks!",

  navbar: {
    home: "Home",
    about: "About",
    booking: "Booking",
  },

  footer: {
    copyright: "© 2025 Go! Badminton. All Rights Reserved.",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
  },

  hero: {
    title: "Go! Badminton",
    clock: "24 hours",
    location:
      "10 Letjen S. Parman Street, Grogol Petamburan, West Jakarta, Indonesia",
    button: "Book now!",
  },

  review: {
    title: "Court Review",
    description:
      "Visually inspect the court condition before making a booking.",
  },

  courtInfo: {
    highlights: {
      title: "Highlights",
      items: [
        "- 6 courts with premium carpet",
        "- Bathrooms equipped with showers",
      ],
    },
    pricing: {
      title: "Hourly Rates",
      weekday: {
        title: "Monday - Friday",
        morning: "08:00 to 18:00 : Rp 50,000",
        time: [
          "(morning - afternoon)",
          "(night)",
        ],
        night: [
          "18:00 to 21:00 (3-hour package) : Rp 180,000",
          "21:00 to 24:00 (3-hour package) : Rp 180,000",
          "24:00 to 03:00 (3-hour package) : Rp 180,000",
          "03:00 to 06:00 (3-hour package) : Rp 180,000",
        ],
      },
      weekend: {
        title: "Saturday - Sunday",
        morning: "08:00 to 18:00 : Rp 60,000",
        time: [
          "(morning - afternoon)",
          "(night)",
        ],
        night: [
          "18:00 to 21:00 (3-hour package) : Rp 200,000",
          "21:00 to 24:00 (3-hour package) : Rp 200,000",
          "24:00 to 03:00 (3-hour package) : Rp 200,000",
          "03:00 to 06:00 (3-hour package) : Rp 200,000",
        ],
      },
    },
    policy: {
      title: "Booking Policy",
      items: [
        "- Online bookings must be paid within 30 minutes after placing the booking.",
        "- To get MEMBER rates, please contact the Admin via WhatsApp at 085712345678.",
      ],
    },
    bookingForm: {
      title: "Book Now",
      dateLabel: "Date",
      placeholderDate: "dd/mm/yy",
      fieldCount: "Number of Courts",
      fieldTimeMorning: "Time (morning - afternoon)",
      fieldTimeNight: "3-hour Package (night)",
      fieldCourt: "Court",
      courts: [
        "Court 1",
        "Court 2",
        "Court 3",
        "Court 4",
        "Court 5",
        "Court 6",
      ],
      timesMorning: [
        "08:00 - 09:00",
        "09:00 - 10:00",
        "10:00 - 11:00",
        "11:00 - 12:00",
        "12:00 - 13:00",
        "13:00 - 14:00",
        "14:00 - 15:00",
        "15:00 - 16:00",
        "16:00 - 17:00",
        "17:00 - 18:00",
      ],
      timesNight: [
        "18:00 - 21:00",
        "21:00 - 24:00",
        "24:00 - 03:00",
        "03:00 - 06:00",
      ],
      total: "Total",
      button: "Book Now",
    },
  },

  schedule: {
    title: "Check Schedule",
    description: "Check availability for your selected date and time.",
  },
};
