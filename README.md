# Nimbus

Next.js weather app with Tailwind, GSAP, and Open-Meteo.

Open-Meteo is free and does not need an API key. Do not paste leaked OpenWeatherMap keys into this project.

## Stack

- Next.js App Router (SSR + ISR, `revalidate: 600`)
- Tailwind CSS v4
- GSAP + ScrollTrigger + `@gsap/react`
- Open-Meteo geocoding + forecast APIs

## Routes

- `/` — London snapshot, 5-day forecast, city picker
- `/forecast` — search + featured cities
- `/forecast/[city]` — live weather for any city
- `/about`

## Run

```bash
npm install
npm run dev
```

## Deploy on Vercel

Push the repo and import it in Vercel. No environment variables required.

If you later switch to OpenWeatherMap, create your own key at [openweathermap.org](https://openweathermap.org/api) and store it as `OPENWEATHER_API_KEY`.
