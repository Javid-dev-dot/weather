import type { MetadataRoute } from "next";
import { FEATURED_CITIES } from "@/lib/weather";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://nimbus-weather.vercel.app";
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/forecast`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    ...FEATURED_CITIES.map((city) => ({
      url: `${base}/forecast/${encodeURIComponent(city)}`,
      lastModified: new Date(),
    })),
  ];
}
