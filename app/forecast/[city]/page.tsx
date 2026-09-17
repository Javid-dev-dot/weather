import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import ForecastSection from "@/components/ForecastSection";
import HourlyChart from "@/components/HourlyChart";
import DailyStrip from "@/components/DailyStrip";
import CelestialAtmosphereGauge from "@/components/CelestialAtmosphereGauge";
import WeatherApparelAdvisory from "@/components/WeatherApparelAdvisory";
import { FEATURED_CITIES, getWeather, WeatherError } from "@/lib/weather";

type PageProps = {
  params: Promise<{ city: string }>;
};

export const revalidate = 600;

export async function generateStaticParams() {
  return FEATURED_CITIES.map((city) => ({ city }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const name = decodeURIComponent(city);
  try {
    const weather = await getWeather(name);
    return {
      title: `${weather.city} Weather · ${weather.current.temp}° & ${weather.current.label}`,
      description: `Live conditions in ${weather.city}: ${weather.current.temp}°C, feels like ${weather.current.feelsLike}°C. Complete 5-day meteorological forecast and solar telemetry.`,
    };
  } catch {
    return {
      title: `${name} Weather Forecast`,
      description: `Live forecast and atmospheric telemetry for ${name}.`,
    };
  }
}

export default async function CityForecastPage({ params }: PageProps) {
  const { city } = await params;
  const name = decodeURIComponent(city);

  let weather;
  try {
    weather = await getWeather(name);
  } catch (err) {
    if (err instanceof WeatherError && err.status === 404) notFound();
    throw err;
  }

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
    </>
  );
}
