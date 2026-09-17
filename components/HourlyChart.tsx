"use client";

import { useRef, useState } from "react";
import type { HourlyPoint } from "@/lib/weather";
import { gsap, useGSAP } from "@/lib/gsap";
import { ChartLine, Drop, Thermometer } from "@phosphor-icons/react";

type Props = {
  hours: HourlyPoint[];
};

export default function HourlyChart({ hours }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const [activeHour, setActiveHour] = useState<HourlyPoint | null>(null);

  const temps = hours.map((h) => h.temp);
  const minTemp = Math.min(...temps, 0);
  const maxTemp = Math.max(...temps, 1);
  const span = Math.max(maxTemp - minTemp, 1);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 85%",
            once: true,
          },
          defaults: { ease: "power3.out" },
        });

        tl.from(".hourly-header-el", {
          y: 20,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 0.6,
        })
          .from(
            ".hourly-bar-col",
            {
              scaleY: 0.1,
              autoAlpha: 0,
              transformOrigin: "bottom",
              duration: 0.8,
              stagger: 0.02,
            },
            "-=0.3",
          )
          .from(
            ".hourly-temp-tag",
            {
              y: 10,
              autoAlpha: 0,
              duration: 0.4,
              stagger: 0.02,
            },
            "-=0.5",
          );
      });
    },
    { scope: rootRef, dependencies: [hours.length] },
  );

  if (!hours.length) return null;

  return (
    <section
      ref={rootRef}
      className="relative border-y border-line bg-panel/30 px-4 py-20 sm:px-6 md:py-28"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Section Header with Active Hover Feedback */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/50 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky">
              <ChartLine weight="bold" className="size-3 text-sky" />
              Hourly Temperature Trace
            </div>
            <h2 className="hourly-header-el mt-3 font-display text-3xl font-bold tracking-tight text-fog md:text-5xl">
              Next 24 Hours Trajectory
            </h2>
            <p className="hourly-header-el mt-2 text-sm text-mist">
              Scrub horizontally across hours to inspect temperature shifts and precipitation probabilities.
            </p>
          </div>

          {/* Active Hover Inspection Badge */}
          {activeHour ? (
            <div className="flex items-center gap-4 rounded-2xl border border-sky/30 bg-sky/10 px-5 py-2.5 text-sm backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-fog font-bold">
                <Thermometer weight="bold" className="size-4 text-amber" />
                {activeHour.temp}°
              </div>
              <div className="flex items-center gap-1.5 text-cyan">
                <Drop weight="fill" className="size-4" />
                {activeHour.precipProb}% rain prob
              </div>
              <span className="text-xs uppercase tracking-wider font-semibold text-mist">
                At {activeHour.hour}:00
              </span>
            </div>
          ) : (
            <div className="hidden items-center gap-2 text-xs text-mist md:flex">
              <span>High: {maxTemp}°</span>
              <span>•</span>
              <span>Low: {minTemp}°</span>
            </div>
          )}
        </div>

        {/* 24-Hour Interactive Slider */}
        <div className="mt-12 overflow-x-auto pb-4 pt-6">
          <div className="flex min-w-[760px] items-end justify-between gap-2 md:min-w-0 md:gap-3">
            {hours.map((h, i) => {
              const heightPercent = Math.min(
                Math.max(((h.temp - minTemp) / span) * 100, 15),
                100,
              );
              const barHeight = 40 + (heightPercent / 100) * 140;
              const isSelected = activeHour?.time === h.time;

              return (
                <div
                  key={h.time}
                  onMouseEnter={() => setActiveHour(h)}
                  onMouseLeave={() => setActiveHour(null)}
                  className="hourly-bar-col group flex flex-1 cursor-pointer flex-col items-center gap-2.5 transition-transform duration-300 hover:scale-105"
                >
                  <span className={`hourly-temp-tag text-xs font-bold transition-colors ${isSelected ? "text-amber" : "text-fog"}`}>
                    {h.temp}°
                  </span>

                  {/* Dynamic Gradient Bar */}
                  <div className="relative flex h-[180px] w-full max-w-7 flex-col justify-end">
                    <div
                      className={`w-full rounded-full transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-t from-sunset via-amber to-yellow-300 shadow-[0_0_20px_rgba(242,130,40,0.8)] scale-x-110"
                          : i % 2 === 0
                            ? "bg-gradient-to-t from-sky-deep via-sky to-cyan shadow-[0_0_15px_rgba(90,168,230,0.3)]"
                            : "bg-gradient-to-t from-sky/40 via-sky/70 to-cyan/80"
                      }`}
                      style={{ height: barHeight }}
                    />
                  </div>

                  {/* Precip Indicator */}
                  {h.precipProb > 15 ? (
                    <span className="flex items-center gap-0.5 text-[10px] font-semibold text-cyan">
                      <Drop weight="fill" className="size-2.5" />
                      {h.precipProb}%
                    </span>
                  ) : (
                    <span className="text-[10px] text-mist/60">•</span>
                  )}

                  <span className="text-xs font-mono text-mist group-hover:text-fog transition-colors">
                    {h.hour}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
