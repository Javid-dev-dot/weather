"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Cpu } from "@phosphor-icons/react";
import { gsap, useGSAP } from "@/lib/gsap";

const ARCHITECTURE = [
  { label: "Data Source", value: "Open-Meteo Global API (WMO Standard)" },
  { label: "Animation Engine", value: "GSAP 3.13 + ScrollTrigger + Motion" },
  { label: "Smooth Scroll", value: "Lenis 1.15 High-Refresh Virtualizer" },
  { label: "Shader Graphics", value: "WebGL 2D Simplex Atmospheric Flow" },
  { label: "Typography", value: "Syne (Display) + Outfit (Technical Sans)" },
  { label: "A11y Compliance", value: "WCAG AA Contrast & Prefers-Reduced-Motion" },
];

export default function AboutPage() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".about-anim-header", {
          y: 28,
          autoAlpha: 0,
          duration: 0.7,
        })
          .from(
            ".about-spec-card",
            {
              scale: 0.92,
              autoAlpha: 0,
              y: 20,
              stagger: 0.06,
              duration: 0.6,
            },
            "-=0.3",
          )
          .from(
            ".about-prose-block",
            {
              y: 20,
              autoAlpha: 0,
              duration: 0.7,
            },
            "-=0.3",
          );
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="px-4 pb-28 pt-32 sm:px-6 md:pt-36"
    >
      <div className="mx-auto max-w-[960px]">
        {/* Header */}
        <div className="about-anim-header flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-sky/30 bg-sky/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sky">
            <Cpu weight="bold" className="size-3.5 text-sky" />
            Engineering & Atmospheric Design
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-fog sm:text-5xl md:text-6xl">
            Atmospheric Intelligence Architecture
          </h1>
          <p className="max-w-[62ch] text-base leading-relaxed text-mist">
            Nimbus merges open meteorological sciences with bespoke WebGL canvas shaders, buttery-smooth
            physics-driven scroll orchestration, and tactical extreme weather advisory.
          </p>
        </div>

        {/* Technical Specs Grid */}
        <div className="mt-12 grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3">
          {ARCHITECTURE.map((item) => (
            <div
              key={item.label}
              className="about-spec-card double-bezel"
            >
              <div className="double-bezel-inner p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan">
                  {item.label}
                </p>
                <p className="mt-2 font-display text-sm font-bold text-fog">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Narrative Section */}
        <div className="about-prose-block double-bezel mt-12">
          <div className="double-bezel-inner space-y-6 p-8 text-base leading-relaxed text-mist">
            <h2 className="font-display text-2xl font-bold text-fog">
              Open Science & Honest Execution
            </h2>
            <p>
              Nimbus connects directly to the Open-Meteo meteorological pipeline, retrieving real-time
              barometric pressure, solar position vectors, cloud density, and multi-model forecast
              curves without intrusive tracking or walled API credentials.
            </p>
            <p>
              The visual language is synthesized from modern atmospheric and editorial design inspirations:
              frosted double-bezel card architecture, high-contrast typography, solar arc azimuth tracking,
              and fashion-forward extreme weather attire recommendations.
            </p>
            <p>
              Smooth scrolling is orchestrated via Lenis synchronized into GSAP’s hardware-accelerated ticker,
              ensuring buttery 60 FPS motion across every touch and wheel input.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 flex items-center justify-start">
          <Link
            href="/forecast"
            className="group inline-flex items-center gap-3 rounded-full bg-sky px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink shadow-[0_4px_20px_rgba(90,168,230,0.5)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(90,168,230,0.7)] active:scale-[0.98]"
          >
            <span>Launch City Explorer</span>
            <span className="flex size-6 items-center justify-center rounded-full bg-ink/15 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight weight="bold" className="size-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
