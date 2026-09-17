"use client";

import { useRef } from "react";
import type { DailyForecast } from "@/lib/weather";
import WeatherCard from "./WeatherCard";
import { gsap, useGSAP } from "@/lib/gsap";
import { CalendarDots } from "@phosphor-icons/react";

type Props = {
  days: DailyForecast[];
  city: string;
};

export default function ForecastSection({ days, city }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".forecast-card");
      if (!cards.length) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".forecast-header-el", {
          y: 24,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
        });

        gsap.from(cards, {
          y: 44,
          autoAlpha: 0,
          scale: 0.94,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        });
      });

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef, dependencies: [city, days.length] },
  );

  return (
    <section
      ref={sectionRef}
      id="forecast"
      className="px-4 py-24 sm:px-6 md:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Section Header */}
        <div className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-panel/40 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sky">
            <CalendarDots weight="bold" className="size-3 text-sky" />
            Meteorological Outlook
          </div>
          <h2 className="forecast-header-el font-display text-3xl font-bold tracking-tight text-fog md:text-5xl">
            Five-Day Outlook over {city}
          </h2>
          <p className="forecast-header-el max-w-[54ch] text-base leading-relaxed text-mist">
            Projected thermal ranges, precipitation volumes, and wind gradients computed from high-resolution satellite passes.
          </p>
        </div>

        {/* 5-Card Grid */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {days.map((day, i) => (
            <WeatherCard key={day.date} day={day} featured={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
