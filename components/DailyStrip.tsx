"use client";

import { useRef } from "react";
import type { DailyForecast } from "@/lib/weather";
import WeatherIcon from "./WeatherIcon";
import { gsap, useGSAP } from "@/lib/gsap";
import { SunDim, Drop, Wind } from "@phosphor-icons/react";

export default function DailyStrip({ days }: { days: DailyForecast[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const cellsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cells = cellsRef.current?.querySelectorAll(".daily-strip-cell");
        if (!cells || !cells.length) return;
        gsap.from(cells, {
          scale: 0.94,
          y: 24,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 85%",
            once: true,
          },
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="double-bezel overflow-hidden">
          <div
            ref={cellsRef}
            className="double-bezel-inner grid divide-y divide-line sm:grid-cols-2 md:grid-cols-5 md:divide-x md:divide-y-0"
          >
            {days.map((day) => (
              <div
                key={day.date}
                className="daily-strip-cell group relative flex flex-col justify-between p-6 transition-all duration-300 hover:bg-white/[0.04]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
                      {day.weekday}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-medium text-amber">
                      <SunDim weight="fill" className="size-3" /> UV {day.uv}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      <WeatherIcon code={day.code} className="size-10 text-sky" />
                    </div>
                    <div className="text-right">
                      <p className="font-display text-3xl font-extrabold text-fog">
                        {day.tempMax}°
                      </p>
                      <p className="text-xs text-mist">Low {day.tempMin}°</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-line/60 pt-3">
                  <p className="text-xs text-mist line-clamp-1">{day.label}</p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-dim">
                    <span className="flex items-center gap-1">
                      <Drop weight="bold" className="size-3 text-cyan" /> {day.precip.toFixed(1)}mm
                    </span>
                    <span className="flex items-center gap-1">
                      <Wind weight="bold" className="size-3 text-sky" /> {day.wind}km/h
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
