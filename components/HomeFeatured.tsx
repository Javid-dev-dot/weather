"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, GlobeHemisphereWest } from "@phosphor-icons/react";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  cities: readonly string[];
};

export default function HomeFeatured({ cities }: Props) {
  const gridRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gridRef.current?.querySelectorAll(".city-dest-card");
        if (!cards || !cards.length) return;
        gsap.from(cards, {
          scale: 0.92,
          autoAlpha: 0,
          y: 28,
          stagger: 0.06,
          duration: 0.7,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            once: true,
          },
        });
      });
    },
    { scope: gridRef },
  );

  return (
    <ul
      ref={gridRef}
      className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {cities.map((city) => (
        <li key={city}>
          <Link
            href={`/forecast/${encodeURIComponent(city)}`}
            className="city-dest-card group double-bezel block transition-all duration-500 hover:-translate-y-1.5 active:scale-[0.98]"
          >
            <div className="double-bezel-inner flex items-center justify-between p-5">
              <div className="flex items-center gap-3.5">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-sky/10 text-sky ring-1 ring-sky/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <GlobeHemisphereWest weight="light" className="size-5" />
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-fog group-hover:text-sky-light transition-colors">
                    {city}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-mist">
                    Live Stream
                  </p>
                </div>
              </div>

              <span className="flex size-8 items-center justify-center rounded-full bg-white/5 text-sky ring-1 ring-line transition-all duration-500 group-hover:bg-sky group-hover:text-ink group-hover:shadow-[0_0_15px_rgba(90,168,230,0.6)]">
                <ArrowUpRight
                  weight="bold"
                  className="size-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
