import { weatherLabel, windLabel } from "./weather-codes";

const GEOCODE = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST = "https://api.open-meteo.com/v1/forecast";
const REVALIDATE = 600;

export class WeatherError extends Error {
  status: number;
  constructor(message: string, status = 404) {
    super(message);
    this.name = "WeatherError";
    this.status = status;
  }
}

export type DailyForecast = {
  date: string;
  day: string;
  weekday: string;
  code: number;
  label: string;
  tempMax: number;
  tempMin: number;
  precip: number;
  wind: number;
  uv: number;
  sunrise: string;
  sunset: string;
};

export type HourlyPoint = {
  time: string;
  hour: string;
  temp: number;
  precipProb: number;
};

export type CurrentWeather = {
  temp: number;
  feelsLike: number;
  humidity: number;
  precip: number;
  code: number;
  label: string;
  isDay: boolean;
  cloudCover: number;
  pressure: number;
  windSpeed: number;
  windDir: number;
  windCompass: string;
};

export type WeatherPayload = {
  city: string;
  country: string;
  admin: string;
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  daily: DailyForecast[];
  hourly: HourlyPoint[];
};

type GeoResult = {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  timezone?: string;
};

type GeoResponse = { results?: GeoResult[] };

type ForecastResponse = {
  timezone: string;
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    weather_code: number;
    cloud_cover: number;
    pressure_msl: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
    uv_index_max: number[];
    sunrise: string[];
    sunset: string[];
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
  };
};

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: REVALIDATE } });
  if (!res.ok) {
    throw new WeatherError("Weather service is unavailable.", 502);
  }
  return res.json() as Promise<T>;
}

function getCurrentIsoInTz(timeZone: string) {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date());
    const y = parts.find((p) => p.type === "year")?.value;
    const m = parts.find((p) => p.type === "month")?.value;
    const d = parts.find((p) => p.type === "day")?.value;
    const h = parts.find((p) => p.type === "hour")?.value;
    return `${y}-${m}-${d}T${h}:00`;
  } catch {
    return "";
  }
}

function formatWeekday(isoDate: string, timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    timeZone,
  }).format(new Date(`${isoDate}T12:00:00`));
}

function formatDay(isoDate: string, timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone,
  }).format(new Date(`${isoDate}T12:00:00`));
}

function formatHour(iso: string, timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    hourCycle: "h23",
    timeZone,
  }).format(new Date(iso));
}

function clock(iso: string, timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone,
  }).format(new Date(iso));
}

export async function getWeather(cityQuery: string): Promise<WeatherPayload> {
  const q = cityQuery.trim();
  if (!q) {
    throw new WeatherError("Enter a city name.");
  }

  const geo = await getJson<GeoResponse>(
    `${GEOCODE}?name=${encodeURIComponent(q)}&count=1&language=en&format=json`,
  );
  const place = geo.results?.[0];
  if (!place) {
    throw new WeatherError(`No match for “${q}”. Try another city.`);
  }

  const params = new URLSearchParams({
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    timezone: "auto",
    forecast_days: "5",
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "is_day",
      "precipitation",
      "weather_code",
      "cloud_cover",
      "pressure_msl",
      "wind_speed_10m",
      "wind_direction_10m",
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_sum",
      "wind_speed_10m_max",
      "uv_index_max",
      "sunrise",
      "sunset",
    ].join(","),
    hourly: "temperature_2m,precipitation_probability",
  });

  const raw = await getJson<ForecastResponse>(`${FORECAST}?${params}`);
  const tz = raw.timezone || place.timezone || "UTC";
  const lookLabel = weatherLabel(raw.current.weather_code);

  const daily: DailyForecast[] = raw.daily.time.map((date, i) => {
    const code = raw.daily.weather_code[i];
    return {
      date,
      day: formatDay(date, tz),
      weekday: formatWeekday(date, tz),
      code,
      label: weatherLabel(code),
      tempMax: Math.round(raw.daily.temperature_2m_max[i]),
      tempMin: Math.round(raw.daily.temperature_2m_min[i]),
      precip: raw.daily.precipitation_sum[i],
      wind: Math.round(raw.daily.wind_speed_10m_max[i]),
      uv: Math.round(raw.daily.uv_index_max[i]),
      sunrise: clock(raw.daily.sunrise[i], tz),
      sunset: clock(raw.daily.sunset[i], tz),
    };
  });

  const currentIso = getCurrentIsoInTz(tz);
  let startIndex = raw.hourly.time.findIndex((t) => t >= currentIso);
  if (startIndex === -1) startIndex = 0;
  startIndex = Math.min(startIndex, Math.max(0, raw.hourly.time.length - 24));

  const hourly: HourlyPoint[] = raw.hourly.time
    .slice(startIndex, startIndex + 24)
    .map((time, idx) => {
      const actualIdx = startIndex + idx;
      return {
        time,
        hour: formatHour(time, tz),
        temp: Math.round(raw.hourly.temperature_2m[actualIdx]),
        precipProb: raw.hourly.precipitation_probability[actualIdx] ?? 0,
      };
    });

  return {
    city: place.name,
    country: place.country ?? "",
    admin: place.admin1 ?? "",
    latitude: place.latitude,
    longitude: place.longitude,
    timezone: tz,
    current: {
      temp: Math.round(raw.current.temperature_2m),
      feelsLike: Math.round(raw.current.apparent_temperature),
      humidity: raw.current.relative_humidity_2m,
      precip: raw.current.precipitation,
      code: raw.current.weather_code,
      label: lookLabel,
      isDay: raw.current.is_day === 1,
      cloudCover: raw.current.cloud_cover,
      pressure: Math.round(raw.current.pressure_msl),
      windSpeed: Math.round(raw.current.wind_speed_10m),
      windDir: raw.current.wind_direction_10m,
      windCompass: windLabel(raw.current.wind_direction_10m),
    },
    daily,
    hourly,
  };
}

export const FEATURED_CITIES = [
  "London",
  "Tokyo",
  "New York",
  "Reykjavik",
  "Nairobi",
  "Sydney",
  "Lisbon",
  "Oslo",
] as const;
