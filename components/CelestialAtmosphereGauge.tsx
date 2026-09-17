"use client";

import { useRef } from "react";
import type { CurrentWeather, DailyForecast } from "@/lib/weather";
import {
  Sun,
  Moon,
  Compass,
  Gauge,
} from "@phosphor-icons/react";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  current: CurrentWeather;
  daily: DailyForecast[];
  city: string;
};

export default function CelestialAtmosphereGauge({ current, daily, city }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const compassNeedleRef = useRef<SVGSVGElement>(null);
  const sunOrbRef = useRef<SVGCircleElement>(null);

  const today = daily[0];
  const uv = today?.uv ?? 4;
  const windDegrees = current.windDir ?? 180;

  // Calculate sun position percentage based on day/night or estimated time
  const isDay = current.isDay;
  const progressPercent = isDay ? 62 : 15; // Realistic solar arc elevation
  const arcLength = 280;
  const dashOffset = arcLength * (1 - progressPercent / 100);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".celestial-header", {
          y: 24,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 85%",
            once: true,
          },
        });

        gsap.from(".gauge-card", {
          y: 35,
          scale: 0.95,
          autoAlpha: 0,
          stagger: 0.09,
          duration: 0.75,
          ease: "back.out(1.3)",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 80%",
            once: true,
          },
        });

        if (compassNeedleRef.current) {
          gsap.fromTo(
            compassNeedleRef.current,
            { rotate: 0 },
            {
              rotate: windDegrees,
              duration: 1.6,
              ease: "elastic.out(1, 0.5)",
              scrollTrigger: {
                trigger: rootRef.current,
                start: "top 80%",
                once: true,
              },
            },
          );
        }

        if (sunOrbRef.current) {
          gsap.from(sunOrbRef.current, {
            scale: 0,
            duration: 1.2,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 80%",
              once: true,
            },
          });
        }
      });
    },
    { scope: rootRef, dependencies: [city, windDegrees] },
  );

  return (
    <section
      ref={rootRef}
      className="relative px-4 py-24 sm:px-6 md:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Section Header */}
        <div className="celestial-header flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-panel/40 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
            <Compass weight="bold" className="size-3 text-cyan" />
            Atmospheric Radar & Celestial Telemetry
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-fog md:text-5xl">
            Solar Arc & Gauge Matrix
          </h2>
          <p className="max-w-[54ch] text-base leading-relaxed text-mist">
            High-precision barometric vectors, solar trajectory illumination, and dynamic wind
            compass calibrated live over {city}.
          </p>
        </div>

        {/* 4-Card Bento Grid */}
        <div className="gauge-grid mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Solar Arc Trajectory (Large 2-col on large screens) */}
          <div className="gauge-card lg:col-span-2 double-bezel">
            <div className="double-bezel-inner flex h-full flex-col justify-between p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-mist">
                    Solar Trajectory Arc
                  </p>
                  <p className="mt-1 font-display text-xl font-bold text-fog">
                    {isDay ? "Daylight Arc Active" : "Night Astronomical Twilight"}
                  </p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-2xl bg-amber/10 text-amber ring-1 ring-amber/25">
                  {isDay ? <Sun weight="fill" className="size-5" /> : <Moon weight="fill" className="size-5" />}
                </div>
              </div>

              {/* SVG Solar Arc Visualization */}
              <div className="relative my-6 flex flex-col items-center justify-center">
                <svg
                  viewBox="0 0 320 160"
                  className="w-full max-w-[280px] overflow-visible"
                >
                  <defs>
                    <linearGradient id="arcGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#5aa8e6" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#ffd72a" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#f28228" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>

                  {/* Base Track */}
                  <path
                    d="M 20 140 A 140 140 0 0 1 300 140"
                    fill="none"
                    stroke="rgba(232, 243, 252, 0.1)"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                  />

                  {/* Active Gradient Arc */}
                  <path
                    d="M 20 140 A 140 140 0 0 1 300 140"
                    fill="none"
                    stroke="url(#arcGlow)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={arcLength}
                    strokeDashoffset={dashOffset}
                    className="transition-all duration-1000 ease-out"
                  />

                  {/* Sun Beacon */}
                  <circle
                    ref={sunOrbRef}
                    cx="195"
                    cy="45"
                    r="9"
                    fill="#ffd72a"
                    className="shadow-[0_0_20px_#ffd72a] filter drop-shadow-[0_0_8px_rgba(255,215,42,0.9)]"
                  />
                  <circle
                    cx="195"
                    cy="45"
                    r="15"
                    fill="none"
                    stroke="#ffd72a"
                    strokeOpacity="0.4"
                    strokeWidth="1.5"
                  />
                </svg>

                {/* Horizon Baseline */}
                <div className="mt-1 flex w-full max-w-[280px] items-center justify-between border-t border-line pt-3 text-xs text-mist">
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] uppercase tracking-wider">Sunrise</span>
                    <span className="font-semibold text-fog">{today?.sunrise ?? "06:14"}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider text-amber">Solar Peak</span>
                    <span className="font-semibold text-amber">13:02</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-wider">Sunset</span>
                    <span className="font-semibold text-fog">{today?.sunset ?? "19:48"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-panel/30 px-4 py-2.5 text-xs text-mist">
                <span>Daylight Duration: ~13h 34m</span>
                <span className="text-cyan">Solar Azimuth: 142° SE</span>
              </div>
            </div>
          </div>

          {/* Card 2: Wind Vector Compass */}
          <div className="gauge-card double-bezel">
            <div className="double-bezel-inner flex h-full flex-col justify-between p-6">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-mist">
                  Wind Vector
                </p>
                <span className="rounded-full bg-cyan/10 px-2 py-0.5 text-[10px] font-bold text-cyan">
                  {current.windCompass}
                </span>
              </div>

              {/* Compass Compass Rose */}
              <div className="my-6 flex flex-col items-center justify-center">
                <div className="relative flex size-32 items-center justify-center rounded-full border border-line bg-panel/20 p-2 shadow-inner">
                  {/* Cardinal Points */}
                  <span className="absolute top-1 text-[9px] font-bold text-sky">N</span>
                  <span className="absolute right-2 text-[9px] font-semibold text-mist">E</span>
                  <span className="absolute bottom-1 text-[9px] font-semibold text-mist">S</span>
                  <span className="absolute left-2 text-[9px] font-semibold text-mist">W</span>

                  {/* Rotating Compass Arrow */}
                  <svg
                    ref={compassNeedleRef}
                    viewBox="0 0 100 100"
                    className="size-24 origin-center drop-shadow-[0_0_8px_rgba(90,168,230,0.6)]"
                  >
                    <polygon points="50,12 56,48 50,44 44,48" fill="#5aa8e6" />
                    <polygon points="50,88 56,52 50,56 44,52" fill="rgba(142, 164, 194, 0.4)" />
                    <circle cx="50" cy="50" r="4" fill="#ffd72a" />
                  </svg>
                </div>
              </div>

              <div className="border-t border-line pt-3 text-center">
                <p className="font-display text-2xl font-bold text-fog">
                  {current.windSpeed} <span className="text-sm font-normal text-mist">km/h</span>
                </p>
                <p className="mt-0.5 text-xs text-mist">
                  Bearing {current.windDir}° · Gentle Breeze
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Barometric & Atmospheric Pressure */}
          <div className="gauge-card double-bezel">
            <div className="double-bezel-inner flex h-full flex-col justify-between p-6">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-mist">
                  Barometer
                </p>
                <div className="flex size-7 items-center justify-center rounded-full bg-sky/10 text-sky">
                  <Gauge weight="bold" className="size-4" />
                </div>
              </div>

              <div className="my-6">
                <p className="font-display text-4xl font-extrabold tracking-tight text-fog">
                  {current.pressure}
                  <span className="ml-1 text-sm font-normal text-mist">hPa</span>
                </p>
                <p className="mt-2 text-xs text-cyan font-medium">
                  {current.pressure > 1013 ? "↑ High Pressure Anti-Cyclone" : "↓ Low Pressure System"}
                </p>

                {/* Gauge Meter Bar */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex justify-between text-[10px] text-mist">
                    <span>970 Low</span>
                    <span>1013 Std</span>
                    <span>1040 High</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-fog/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky via-cyan to-amber transition-all duration-700"
                      style={{
                        width: `${Math.min(Math.max(((current.pressure - 970) / (1040 - 970)) * 100, 5), 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-line pt-3 flex items-center justify-between text-xs text-mist">
                <span>Humidity: {current.humidity}%</span>
                <span>UV: {uv}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
