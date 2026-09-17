import CitySearch from "@/components/CitySearch";
import Hero from "@/components/Hero";
import ForecastSection from "@/components/ForecastSection";
import HourlyChart from "@/components/HourlyChart";
import DailyStrip from "@/components/DailyStrip";
import CelestialAtmosphereGauge from "@/components/CelestialAtmosphereGauge";
import WeatherApparelAdvisory from "@/components/WeatherApparelAdvisory";
import HomeFeatured from "@/components/HomeFeatured";
import { FEATURED_CITIES, getWeather } from "@/lib/weather";
import { GlobeHemisphereEast } from "@phosphor-icons/react/dist/ssr";

export const revalidate = 600;

export default async function HomePage() {
  const weather = await getWeather("London");

  return (
    <>
      <Hero weather={weather} />
      <HourlyChart hours={weather.hourly} />
      <CelestialAtmosphereGauge
        current={weather.current}
        daily={weather.daily}
        city={weather.city}
      />
      <WeatherApparelAdvisory
        current={weather.current}
        daily={weather.daily}
        city={weather.city}
      />
      <ForecastSection days={weather.daily} city={weather.city} />
      <DailyStrip days={weather.daily} />

      <section className="px-4 py-24 sm:px-6 md:py-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-panel/40 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sky">
              <GlobeHemisphereEast weight="bold" className="size-3.5 text-sky" />
              Global Weather Network
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-fog md:text-5xl">
              Other Skies & Key Megacities
            </h2>
            <p className="max-w-[54ch] text-base leading-relaxed text-mist">
              Jump instantaneously across leading meteorological zones to compare barometric pressure,
              live solar progress, and precipitation forecasts.
            </p>
          </div>

          <HomeFeatured cities={[...FEATURED_CITIES]} />

          <div className="mt-14 max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-mist">
              Search Any Custom Coordinates or City
            </p>
            <CitySearch size="hero" />
          </div>
        </div>
      </section>
    </>
  );
}
