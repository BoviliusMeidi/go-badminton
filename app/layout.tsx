import { JSX } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Inika } from "next/font/google";
import { LanguageProvider } from "./LanguageContext";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";

/**
 * Configures and loads the 'Inika' Google Font.
 * This setup makes the font available as a CSS variable: `--font-inika`.
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/fonts
 */
const inika = Inika({
  variable: "--font-inika",
  weight: "400",
  subsets: ["latin"],
});

/**
 * Static metadata for the application.
 * Used by Next.js to set the page title and description for SEO.
 */
export const metadata: Metadata = {
  title: "Go! Badminton",
  description:
    "Platform penyewaan lapangan badminton yang mudah dan cepat. Pesan lapangan favorit Anda secara online hanya dengan beberapa klik!",
};

/**
 * The root layout component for the entire application.
 *
 * This component sets up the basic HTML structure, applies the global
 * 'Inika' font, and wraps all child pages (`children`)
 * with the `LanguageProvider` to enable internationalization.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child pages or layouts to be rendered.
 * @returns {JSX.Element} The root HTML document structure.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="id">
      <body className={`${inika.variable} antialiased`}>
        <LanguageProvider>
          <NavBar />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
