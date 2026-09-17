"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const STATUS_MESSAGES = [
  "Calibrating Barometric Sensors",
  "Sampling Solar Trajectory",
  "Synchronizing Cloud Vectors",
  "Atmospheric Stream Connected",
];

const MIN_LOADER_DURATION = 1500;

export default function PageLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !loaderRef.current) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      sessionStorage.getItem("nimbus-loaded") === "true"
    ) {
      gsap.set(loaderRef.current, { display: "none" });
      return;
    }

    sessionStorage.setItem("nimbus-loaded", "true");
    const startedAt = performance.now();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          const remaining = Math.max(
            0,
            MIN_LOADER_DURATION - (performance.now() - startedAt),
          );

          gsap.delayedCall(remaining / 1000, () => {
            if (loaderRef.current) {
              gsap.set(loaderRef.current, { display: "none" });
              ScrollTrigger.refresh();
            }
          });
        },
      });

      const counter = { val: 0 };

      tl.set(loaderRef.current, { autoAlpha: 1 })
        .fromTo(
          orbRef.current,
          { scale: 0.5, autoAlpha: 0, rotate: -45 },
          { scale: 1, autoAlpha: 1, rotate: 0, duration: 0.9, ease: "back.out(1.4)" },
        )
        .fromTo(
          ringRef.current,
          { scale: 0.3, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 0.8 },
          "-=0.6",
        )
        .to(
          counter,
          {
            val: 100,
            duration: 1.6,
            ease: "power2.inOut",
            onUpdate: () => {
              if (percentRef.current) {
                percentRef.current.innerText = `${Math.round(counter.val)}%`;
              }
              if (statusRef.current) {
                const idx = Math.min(
                  Math.floor((counter.val / 100) * STATUS_MESSAGES.length),
                  STATUS_MESSAGES.length - 1,
                );
                statusRef.current.innerText = STATUS_MESSAGES[idx];
              }
            },
          },
          "-=0.4",
        )
        .to(
          orbRef.current,
          {
            scale: 1.25,
            boxShadow: "0 0 120px 40px rgba(90,168,230,0.8)",
            duration: 0.5,
            ease: "power2.in",
          },
          "+=0.1",
        )
        .to(
          [statusRef.current, percentRef.current, ringRef.current],
          { autoAlpha: 0, y: -10, duration: 0.35 },
          "-=0.3",
        )
        .to(
          loaderRef.current,
          {
            clipPath: "inset(0 0 100% 0)",
            duration: 0.85,
            ease: "power4.inOut",
          },
          "-=0.1",
        );
    }, loaderRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={loaderRef}
      className="page-loader fixed inset-0 z-9999 flex flex-col items-center justify-center bg-ink text-fog"
      aria-label="Loading application"
    >
      <div className="relative flex flex-col items-center">
        <div className="loader-orb-wrapper relative flex size-32 items-center justify-center">
          <div
            ref={ringRef}
            className="absolute inset-0 rounded-full border border-sky/30 border-t-amber animate-spin"
            style={{ animationDuration: "3s" }}
          />
          <div
            className="absolute -inset-3 rounded-full border border-dashed border-cyan/25 animate-spin"
            style={{ animationDuration: "12s", animationDirection: "reverse" }}
          />
          <div
            ref={orbRef}
            className="loader-orb size-20 rounded-full bg-linear-to-tr from-sunset via-sky to-twilight shadow-[0_0_60px_15px_rgba(242,130,40,0.4)]"
          />
        </div>

        <div className="mt-8 flex flex-col items-center text-center">
          <span className="font-display text-sm font-bold uppercase tracking-[0.3em] text-fog">
            Nimbus Atmosphere
          </span>
          <span
            ref={percentRef}
            className="mt-2 font-display text-3xl font-light tracking-tight text-sky"
          >
            0%
          </span>
          <p
            ref={statusRef}
            className="mt-2 min-h-6 text-[11px] uppercase tracking-[0.2em] text-mist"
          >
            Calibrating Barometric Sensors
          </p>
        </div>
      </div>
    </div>
  );
}
