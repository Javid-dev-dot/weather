"use client";

import { useRef, useEffect } from "react";
import type { WeatherPayload } from "@/lib/weather";
import CitySearch from "./CitySearch";
import MetricTile from "./MetricTile";
import WeatherIcon from "./WeatherIcon";
import { gsap, useGSAP } from "@/lib/gsap";
import { Sparkle } from "@phosphor-icons/react";
import Link from "next/link";

type Props = {
  weather: WeatherPayload;
};

const POPULAR_PULSES = ["London", "Tokyo", "New York", "Reykjavik", "Paris"];

export default function Hero({ weather }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);

  const { current, city, country, admin, daily } = weather;
  const place = [admin, country].filter(Boolean).join(", ");
  const today = daily[0];

  useEffect(() => {
    const el = timeRef.current;
    if (!el) return;
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: weather.timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => {
      try {
        el.textContent = `Local ${formatter.format(new Date())}`;
      } catch {
        el.textContent = "";
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [weather.timezone]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".hero-glow", { scale: 0.7, autoAlpha: 0, duration: 1.2 })
          .from(".hero-kicker", { y: 20, autoAlpha: 0, duration: 0.6 }, "-=0.8")
          .from(".hero-title", { y: 36, autoAlpha: 0, duration: 0.8 }, "-=0.4")
          .from(".hero-sub", { y: 20, autoAlpha: 0, duration: 0.6 }, "-=0.4")
          .from(".hero-search-bar", { y: 20, autoAlpha: 0, duration: 0.6 }, "-=0.35")
          .from(".hero-quick-city", { y: 14, autoAlpha: 0, stagger: 0.04, duration: 0.5 }, "-=0.3")
          .from(
            cardRef.current,
            { scale: 0.9, autoAlpha: 0, y: 30, duration: 0.9, ease: "back.out(1.4)" },
            "-=0.7",
          )
          .from(
            ".hero-stat-item",
            { y: 16, autoAlpha: 0, stagger: 0.06, duration: 0.5 },
            "-=0.4",
          );

        gsap.to(".hero-glow", {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    },
    { scope: rootRef, dependencies: [city] },
  );

  // 3D Card Hover Perspective Physics
  useEffect(() => {
    const card = cardRef.current;
    const inner = cardInnerRef.current;
    if (!card || !inner) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const onMouseMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;

          gsap.to(inner, {
            rotateY: x * 10,
            rotateX: -y * 10,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        const onMouseLeave = () => {
          gsap.to(inner, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.6,
            ease: "power3.out",
            overwrite: "auto",
          });
        };

        card.addEventListener("mousemove", onMouseMove);
        card.addEventListener("mouseleave", onMouseLeave);

        return () => {
          card.removeEventListener("mousemove", onMouseMove);
          card.removeEventListener("mouseleave", onMouseLeave);
        };
      });
    });

    return () => ctx.revert();
  }, []);

  const stats = [
    { label: "Humidity", value: `${current.humidity}%` },
    { label: "Wind Velocity", value: `${current.windSpeed} km/h` },
    { label: "Barometer", value: `${current.pressure} hPa` },
    { label: "Cloud Cover", value: `${current.cloudCover}%` },
    { label: "Precipitation", value: `${current.precip.toFixed(1)} mm` },
    { label: "UV Index", value: `${today?.uv ?? 3} / 11` },
  ];

  return (
    <section
      ref={rootRef}
      className="relative isolate overflow-hidden px-4 pb-24 pt-28 sm:px-6 md:pt-32"
    >
      {/* Dynamic Ambient Background Glow */}
      <div className="hero-glow hero-field pointer-events-none absolute inset-x-0 top-0 h-[85%]" />

      <div className="relative mx-auto grid min-h-[85dvh] max-w-[1400px] items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        {/* Left Column: Heading, Search & Pulse Chips */}
        <div>
          <div className="hero-kicker flex flex-wrap items-center gap-2.5">
            <span className="flex items-center gap-1.5 rounded-full border border-sky/30 bg-sky/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky">
              <Sparkle weight="fill" className="size-3 text-amber" />
              {place || country}
            </span>
            <span
              ref={timeRef}
              className="rounded-full border border-line bg-panel/40 px-3 py-1 text-xs font-mono text-mist"
            />
          </div>

          <h1 className="hero-title mt-6 font-display text-5xl font-extrabold leading-[0.94] tracking-[-0.05em] text-fog sm:text-6xl md:text-7xl lg:text-8xl">
            {city} is {current.temp}°
          </h1>

          <p className="hero-sub mt-6 max-w-[48ch] text-lg leading-relaxed text-mist">
            {current.label} conditions with real-time solar tracking, barometric telemetry, and
            five-day meteorological models.
          </p>

          <div className="hero-search-bar mt-8 max-w-lg">
            <CitySearch initial={city} size="hero" />
          </div>

          {/* Quick Switcher Chips */}
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-mist">
            <span className="uppercase tracking-wider text-[10px] font-semibold text-dim">
              Quick Pulse:
            </span>
            {POPULAR_PULSES.map((c) => (
              <Link
                key={c}
                href={`/forecast/${encodeURIComponent(c)}`}
                className="hero-quick-city rounded-full border border-line bg-panel/30 px-3 py-1 text-xs font-medium text-mist transition-all duration-300 hover:border-sky/40 hover:bg-sky/10 hover:text-fog"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column: 3D Double-Bezel Weather Terminal Card */}
        <div
          ref={cardRef}
          className="double-bezel relative origin-center [perspective:1000px]"
        >
          <div
            ref={cardInnerRef}
            className="double-bezel-inner relative p-6 [transform-style:preserve-3d] sm:p-8"
          >
            {/* Top Bar: Condition Banner & Animated Weather Icon */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan">
                  Real-time Atmospheric Reading
                </p>
                <div className="mt-3 flex items-baseline gap-3">
                  <p className="font-display text-7xl font-extrabold tracking-[-0.08em] text-fog sm:text-8xl">
                    {current.temp}°
                  </p>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-mist">
                      Feels {current.feelsLike}°
                    </span>
                    <span className="text-xs font-medium text-cyan">
                      {current.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="float-soft flex size-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-tr from-sky/15 to-cyan/20 p-3 ring-1 ring-sky/30 shadow-[0_0_30px_rgba(90,168,230,0.3)]">
                <WeatherIcon
                  code={current.code}
                  isDay={current.isDay}
                  className="size-14 text-sky drop-shadow-[0_0_12px_rgba(90,168,230,0.8)]"
                />
              </div>
            </div>

            {/* Middle Celestial Pill Tag Strip */}
            <div className="mt-8 flex flex-wrap items-center gap-2 text-xs text-mist">
              <span className="rounded-full border border-line bg-white/5 px-3 py-1 font-medium text-fog">
                Sunrise {today?.sunrise ?? "--:--"}
              </span>
              <span className="rounded-full border border-line bg-white/5 px-3 py-1 font-medium text-fog">
                Sunset {today?.sunset ?? "--:--"}
              </span>
              <span className="rounded-full border border-sky/30 bg-sky/10 px-3 py-1 font-medium text-sky">
                Wind {current.windCompass} {current.windSpeed} km/h
              </span>
            </div>

            {/* Bottom 6-Tile Metrics Grid */}
            <dl className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {stats.map(({ label, value }) => (
                <div key={label} className="hero-stat-item">
                  <MetricTile label={label} value={value} />
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-8 grid max-w-[1400px] grid-cols-2 border-y border-line/80 py-4 sm:grid-cols-4 lg:mt-2">
        <div className="hero-signal border-r border-line px-3 first:pl-0 sm:px-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-dim">Station</p>
          <p className="mt-1 truncate text-sm font-semibold text-fog">{city} / {weather.latitude.toFixed(2)}° N</p>
        </div>
        <div className="hero-signal border-r border-line px-3 sm:px-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-dim">Forecast range</p>
          <p className="mt-1 text-sm font-semibold text-fog">{today?.tempMin ?? "--"}° to {today?.tempMax ?? "--"}°</p>
        </div>
        <div className="hero-signal border-r border-line px-3 sm:px-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-dim">Data cadence</p>
          <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-fog"><span className="size-1.5 rounded-full bg-cyan shadow-[0_0_10px_rgba(73,189,205,0.8)]" />10 min refresh</p>
        </div>
        <div className="hero-signal px-3 sm:px-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-dim">Model confidence</p>
          <p className="mt-1 text-sm font-semibold text-fog">High / 94%</p>
        </div>
      </div>
    </section>
  );
}
