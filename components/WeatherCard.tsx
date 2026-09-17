"use client";

import { useEffect, useRef } from "react";
import type { DailyForecast } from "@/lib/weather";
import WeatherIcon from "./WeatherIcon";
import { gsap } from "@/lib/gsap";
import { Drop, Wind, SunDim, Sparkle } from "@phosphor-icons/react";

type Props = {
  day: DailyForecast;
  featured?: boolean;
};

export default function WeatherCard({ day, featured = false }: Props) {
  const cardRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const inner = innerRef.current;
    if (!card || !inner) return;

    const ctx = gsap.context(() => undefined, card);

    const enter = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.to(card, {
        scale: 1.03,
        y: -8,
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const leave = () => {
      gsap.to(card, {
        scale: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });
      gsap.to(inner, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const move = (e: MouseEvent) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(inner, {
        rotateY: px * 12,
        rotateX: -py * 12,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    card.addEventListener("mouseenter", enter);
    card.addEventListener("mouseleave", leave);
    card.addEventListener("mousemove", move);

    return () => {
      ctx.revert();
      card.removeEventListener("mouseenter", enter);
      card.removeEventListener("mouseleave", leave);
      card.removeEventListener("mousemove", move);
      gsap.killTweensOf([card, inner]);
    };
  }, [day.date]);

  return (
    <article
      ref={cardRef}
      tabIndex={0}
      className={`forecast-card group double-bezel relative origin-center outline-none transition-all duration-500 [perspective:1000px] ${
        featured ? "md:col-span-2 lg:col-span-2" : ""
      }`}
    >
      <div
        ref={innerRef}
        className={`double-bezel-inner flex h-full flex-col justify-between p-6 [transform-style:preserve-3d] ${
          featured ? "min-h-[260px]" : "min-h-[220px]"
        }`}
      >
        <div>
          {/* Header row: weekday & date */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
                {day.weekday}
              </span>
              <p className="text-xs text-mist">{day.day}</p>
            </div>
            {featured && (
              <span className="flex items-center gap-1 rounded-full border border-amber/30 bg-amber/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber">
                <Sparkle weight="fill" className="size-2.5" />
                Today Outlook
              </span>
            )}
          </div>

          {/* Condition description & Weather Icon */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <div>
              <p className="font-display text-4xl font-extrabold tracking-tight text-fog sm:text-5xl">
                {day.tempMax}°
              </p>
              <p className="mt-0.5 text-xs font-medium text-mist">
                Min {day.tempMin}° · {day.label}
              </p>
            </div>
            <div className="flex size-14 items-center justify-center rounded-2xl bg-sky/10 text-sky ring-1 ring-sky/25 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
              <WeatherIcon code={day.code} className="size-10 text-sky" />
            </div>
          </div>
        </div>

        {/* Footer Metrics: Precip & Wind & UV */}
        <div className="mt-6 border-t border-line pt-4">
          <div className="grid grid-cols-3 gap-2 text-center text-xs text-mist">
            <div className="flex flex-col items-center">
              <span className="flex items-center gap-1 text-[10px] uppercase text-dim">
                <Drop weight="bold" className="size-3 text-cyan" /> Rain
              </span>
              <span className="mt-0.5 font-semibold text-fog">{day.precip.toFixed(1)} mm</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="flex items-center gap-1 text-[10px] uppercase text-dim">
                <Wind weight="bold" className="size-3 text-sky" /> Wind
              </span>
              <span className="mt-0.5 font-semibold text-fog">{day.wind} km/h</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="flex items-center gap-1 text-[10px] uppercase text-dim">
                <SunDim weight="bold" className="size-3 text-amber" /> UV
              </span>
              <span className="mt-0.5 font-semibold text-fog">{day.uv} / 11</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
