import type { Metadata } from "next";
import { Inika } from "next/font/google";
import "./globals.css";

const inika = Inika({
  variable: "--font-inika",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Go! Badminton",
  description:
    "Platform penyewaan lapangan badminton yang mudah dan cepat. Pesan lapangan favorit Anda secara online hanya dengan beberapa klik!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inika.variable} antialiased`}>{children}</body>
    </html>
  );
}
