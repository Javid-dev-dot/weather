import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Compass } from "@phosphor-icons/react/dist/ssr";
import CitySearch from "@/components/CitySearch";

export const metadata: Metadata = {
  title: "Global Forecast & Radar Explorer",
  description: "Search live weather, atmospheric pressure, and 5-day outlook for any location on Earth.",
};

const CONTINENTS = [
  { name: "Europe", cities: ["London", "Paris", "Berlin", "Rome", "Oslo", "Lisbon"] },
  { name: "Americas", cities: ["New York", "San Francisco", "Toronto", "Buenos Aires", "São Paulo"] },
  { name: "Asia-Pacific", cities: ["Tokyo", "Seoul", "Singapore", "Sydney", "Auckland", "Bangkok"] },
  { name: "Nordic & Arctic", cities: ["Reykjavik", "Tromsø", "Helsinki", "Nuuk", "Stockholm"] },
];

export default function ForecastIndexPage() {
  return (
    <section className="px-4 pb-28 pt-32 sm:px-6 md:pt-36">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-sky/30 bg-sky/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sky">
            <Compass weight="bold" className="size-3.5 text-sky" />
            Global Meteorological Station
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-fog sm:text-5xl md:text-6xl">
            Explore Any Atmosphere
          </h1>
          <p className="max-w-[54ch] text-base leading-relaxed text-mist">
            Instantaneous satellite telemetry, real-time barometric trends, and apparel advisory
            for over 200,000 global municipalities.
          </p>
        </div>

        {/* Search Bar Island */}
        <div className="mt-10 max-w-xl">
          <CitySearch size="hero" />
        </div>

        {/* Categorized Continent Groups */}
        <div className="mt-16 space-y-12">
          {CONTINENTS.map((region) => (
            <div key={region.name} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-cyan">
                  {region.name}
                </span>
                <div className="h-px flex-1 bg-line" />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                {region.cities.map((city) => (
                  <Link
                    key={city}
                    href={`/forecast/${encodeURIComponent(city)}`}
                    className="group double-bezel block transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="double-bezel-inner flex items-center justify-between p-4">
                      <span className="font-display text-sm font-semibold text-fog group-hover:text-sky transition-colors">
                        {city}
                      </span>
                      <ArrowUpRight
                        weight="bold"
                        className="size-3 text-mist transition-transform duration-300 group-hover:text-sky group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
