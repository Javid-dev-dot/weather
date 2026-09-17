"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { CloudSun, ArrowUp } from "@phosphor-icons/react";
import { gsap } from "@/lib/gsap";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".footer-anim-block", {
          y: 20,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={footerRef}
      className="relative border-t border-line bg-[var(--ink-deep)] px-6 py-16 text-sm text-mist"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand Info */}
          <div className="footer-anim-block max-w-md">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 font-display text-lg font-bold text-fog"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-sky/20 text-sky ring-1 ring-sky/30">
                <CloudSun weight="bold" className="size-4.5" />
              </span>
              <span>Nimbus Weather Intelligence</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-mist">
              High-fidelity meteorological simulation, real-time satellite radar telemetry, and
              extreme weather lifestyle guidance powered by Open-Meteo.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-dim">
              <span className="size-2 rounded-full bg-cyan" />
              <span>Real-time Geocoding & Open Data Engine</span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="footer-anim-block flex flex-wrap gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fog">
                Navigation
              </p>
              <ul className="mt-4 space-y-2.5 text-xs font-medium">
                <li>
                  <Link href="/" className="transition-colors hover:text-sky">
                    Overview Home
                  </Link>
                </li>
                <li>
                  <Link href="/forecast" className="transition-colors hover:text-sky">
                    Global Cities & Radar
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="transition-colors hover:text-sky">
                    Telemetry & Architecture
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fog">
                Data Sources
              </p>
              <ul className="mt-4 space-y-2.5 text-xs font-medium">
                <li>
                  <a
                    href="https://open-meteo.com"
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-sky"
                  >
                    Open-Meteo API
                  </a>
                </li>
                <li>
                  <a
                    href="https://wmo.int"
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-sky"
                  >
                    WMO Meteorological Codes
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Back to Top */}
          <div className="footer-anim-block flex items-start">
            <button
              type="button"
              onClick={scrollToTop}
              className="group flex items-center gap-2 rounded-full border border-line bg-panel/50 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-fog transition-all duration-300 hover:border-sky/40 hover:bg-sky/10"
            >
              <span>Back to Top</span>
              <ArrowUp weight="bold" className="size-3.5 text-sky transition-transform duration-300 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line/60 pt-8 text-xs text-dim sm:flex-row">
          <p>© {new Date().getFullYear()} Nimbus Atmosphere. All rights reserved.</p>
          <p className="font-mono text-[11px]">Precision Engine • WebGL Shader Active • 60 FPS</p>
        </div>
      </div>
    </footer>
  );
}
