/**
 * @fileoverview
 * This file defines the `LeftSection` component for the court information page.
 * It displays static informational content such as:
 * - Highlights (venue features)
 * - Hourly rates (weekday and weekend rates)
 * - Booking policy
 *
 * Text content is dynamically fetched from localization files
 * through the reusable `<Text />` component.
 */

"use client";

import { Text } from "../../components/Text";

/**
 * A section component displaying detailed court information.
 *
 * This component serves as the left column of the booking layout.
 * It contains three main subsections:
 *
 * 1. **Highlights** — Lists the court's features.
 * 2. **Hourly Rates** — Shows hourly pricing for weekdays and weekends.
 * 3. **Booking Policy** — Displays booking and payment rules.
 *
 * @returns {JSX.Element} A responsive, vertically stacked information section.
 */
export default function LeftSection() {
  return (
    <section className="w-full flex flex-col gap-5 px-6 sm:px-29 py-24 font-main">
      <hr className="my-6 border-gray-400" />

      {/* ===================== HIGHLIGHTS ===================== */}
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-bold">
          <Text path="courtInfo.highlights.title" />
        </h1>
        <div className="text-lg text-gray-700 leading-relaxed">
          <p><Text path="courtInfo.highlights.items.0" /></p>
          <p><Text path="courtInfo.highlights.items.1" /></p>
        </div>
      </div>

      {/* ===================== TARIFF SECTION ===================== */}
      <div className="flex flex-col gap-6 mt-12">
        <h1 className="text-4xl font-bold">
          <Text path="courtInfo.pricing.title" />
        </h1>

        {/* === WEEKDAY PRICING (Senin - Jumat) === */}
        <div className="text-lg flex flex-col gap-6">
          <div className="text-lg flex flex-col">
            <p className="font-bold">
              <Text path="courtInfo.pricing.weekday.title" />
            </p>
            <div className="text-lg text-gray-700 leading-relaxed">
              <p><Text path="courtInfo.pricing.weekday.time.0" /></p>
              <p><Text path="courtInfo.pricing.weekday.morning" /></p>
              <p><Text path="courtInfo.pricing.weekday.time.1" /></p>
              <p><Text path="courtInfo.pricing.weekday.night.0" /></p>
              <p><Text path="courtInfo.pricing.weekday.night.1" /></p>
              <p><Text path="courtInfo.pricing.weekday.night.2" /></p>
              <p><Text path="courtInfo.pricing.weekday.night.3" /></p>
            </div>
          </div>

          {/* === WEEKEND PRICING (Sabtu - Minggu) === */}
          <div className="text-lg flex flex-col">
            <p className="font-bold">
              <Text path="courtInfo.pricing.weekend.title" />
            </p>
            <div className="text-lg text-gray-700 leading-relaxed">
              <p><Text path="courtInfo.pricing.weekend.time.0" /></p>
              <p><Text path="courtInfo.pricing.weekend.morning" /></p>
              <p><Text path="courtInfo.pricing.weekend.time.1" /></p>
              <p><Text path="courtInfo.pricing.weekend.night.0" /></p>
              <p><Text path="courtInfo.pricing.weekend.night.1" /></p>
              <p><Text path="courtInfo.pricing.weekend.night.2" /></p>
              <p><Text path="courtInfo.pricing.weekend.night.3" /></p>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== BOOKING POLICY ===================== */}
      <div className="flex flex-col gap-6 mt-12">
        <h1 className="text-4xl font-bold">
          <Text path="courtInfo.policy.title" />
        </h1>
        <div className="text-lg text-gray-700 leading-relaxed">
          <p><Text path="courtInfo.policy.items.0" /></p>
          <p><Text path="courtInfo.policy.items.1" /></p>
        </div>
      </div>
    </section>
  );
}
