/**
 * @fileoverview Indonesian (id) translations for the application.
 *
 * This object contains all the static text strings for the "id" locale.
 * The structure of this object (e.g., 'hero.clock') is used by the
 * <Text> component to dynamically find and render the correct string.
 *
 * @type {object}
 */

export const id: object = {
  title: "Go! Badminton",
  description:
    "Platform penyewaan lapangan badminton yang mudah dan cepat. Pesan lapangan favorit Anda secara online hanya dengan beberapa klik!",

  navbar: {
    home: "Beranda",
    about: "Tentang",
    booking: "Pemesanan",
  },

  footer: {
    copyright: "© 2025 Go! Badminton. Semua Hak Dilindungi.",
    terms: "Syarat dan Ketentuan",
    privacy: "Kebijakan Privasi",
  },

  hero: {
    title: "Go! Badminton",
    clock: "24 jam",
    location: "Jalan Letjen S. Parman No. 10, Grogol Petamburan, Jakarta Barat",
    button: "Pesan sekarang!",
  },

  review: {
    title: "Review Lapangan",
    description:
      "Tinjau kondisi lapangan secara visual sebelum melakukan pemesanan.",
  },

  courtInfo: {
    highlights: {
      title: "Fasilitas Unggulan",
      items: [
        "6 Lapangan dengan karpet premium",
        "Kamar mandi dilengkapi shower",
      ],
    },
    pricing: {
      title: "Tarif per Jam",
      weekday: {
        title: "Senin - Jumat",
        morning: "08.00 s/d 18.00 : Rp 50.000",
        night: [
          "18.00 s/d 21.00 (paket 3 jam) : Rp 180.000",
          "21.00 s/d 24.00 (paket 3 jam) : Rp 180.000",
          "24.00 s/d 03.00 (paket 3 jam) : Rp 180.000",
          "03.00 s/d 06.00 (paket 3 jam) : Rp 180.000",
        ],
      },
      weekend: {
        title: "Sabtu - Minggu",
        morning: "08.00 s/d 18.00 : Rp 60.000",
        night: [
          "18.00 s/d 21.00 (paket 3 jam) : Rp 200.000",
          "21.00 s/d 24.00 (paket 3 jam) : Rp 200.000",
          "24.00 s/d 03.00 (paket 3 jam) : Rp 200.000",
          "03.00 s/d 06.00 (paket 3 jam) : Rp 200.000",
        ],
      },
    },
    policy: {
      title: "Kebijakan Pemesanan",
      items: [
        "Online booking harus dibayar dalam waktu 30 menit setelah melakukan booking.",
        "Untuk mendapatkan rate MEMBER, silakan hubungi Admin via WhatsApp 085712345678.",
      ],
    },
    bookingForm: {
      title: "Pesan Sekarang",
      dateLabel: "Tanggal",
      placeholderDate: "dd/mm/yy",
      fieldCount: "Jumlah Lapangan",
      fieldTimeMorning: "Jam (pagi - sore)",
      fieldTimeNight: "Paket 3 jam (malam)",
      fieldCourt: "Lapangan",
      courts: [
        "Lapangan 1",
        "Lapangan 2",
        "Lapangan 3",
        "Lapangan 4",
        "Lapangan 5",
        "Lapangan 6",
      ],
      timesMorning: [
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
      ],
      timesNight: [
        "18.00 - 21.00",
        "21.00 - 24.00",
        "24.00 - 03.00",
        "03.00 - 06.00",
      ],
      total: "Total",
      button: "Pesan Sekarang",
    },
  },

  schedule: {
    title: "Cek Jadwal",
    description:
      "Periksa ketersediaan untuk tanggal dan waktu yang Anda pilih.",
  },
};
