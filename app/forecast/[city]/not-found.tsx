"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import CitySearch from "@/components/CitySearch";
import { gsap } from "@/lib/gsap";

export default function CityNotFound() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".nf-line", {
          y: 20,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power3.out",
        });
      });
      return () => ctx.revert();
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="flex min-h-[100dvh] flex-col justify-center px-6 pt-24"
    >
      <div className="mx-auto max-w-[720px]">
        <h1 className="nf-line font-display text-5xl tracking-tight text-fog">
          City not found
        </h1>
        <p className="nf-line mt-4 max-w-[50ch] text-mist">
          Open-Meteo has no match for that name. Try a larger nearby city.
        </p>
        <div className="nf-line mt-8 max-w-md">
          <CitySearch />
        </div>
        <Link
          href="/forecast"
          className="nf-line mt-8 inline-block text-sky transition-colors duration-300 hover:text-cyan"
        >
          Browse featured cities
        </Link>
      </div>
    </section>
  );
}
