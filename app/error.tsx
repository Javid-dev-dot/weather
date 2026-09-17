"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".err-line", {
          y: 18,
          autoAlpha: 0,
          stagger: 0.08,
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
        <h1 className="err-line font-display text-5xl tracking-tight text-fog">
          Forecast unavailable
        </h1>
        <p className="err-line mt-4 max-w-[50ch] text-mist">
          Open-Meteo did not respond. Check the connection and try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="err-line mt-8 rounded-full bg-sky px-6 py-3 text-sm font-medium text-ink shadow-[0_10px_20px_-12px_rgba(90,168,230,0.6)] transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_15px_30px_-12px_rgba(90,168,230,0.7)]"
        >
          Retry
        </button>
      </div>
    </section>
  );
}
