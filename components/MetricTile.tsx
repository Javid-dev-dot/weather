"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

type MetricTileProps = {
  label: string;
  value: string;
  accent?: boolean;
};

export default function MetricTile({
  label,
  value,
  accent = false,
}: MetricTileProps) {
  const tileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tileRef.current;
    if (!el) return;

    const ctx = gsap.context(() => undefined, el);

    const onEnter = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.to(el, {
        scale: 1.04,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(el, {
        borderColor: "var(--sky)",
        boxShadow: "0 0 20px -5px rgba(90,168,230,0.4)",
        duration: 0.35,
        overwrite: "auto",
      });
    };
    const onLeave = () => {
      gsap.to(el, {
        scale: 1,
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      });
      gsap.to(el, {
        borderColor: "var(--line)",
        boxShadow: "none",
        duration: 0.4,
        overwrite: "auto",
      });
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("focus", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("blur", onLeave);

    return () => {
      ctx.revert();
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("focus", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("blur", onLeave);
      gsap.killTweensOf(el);
    };
  }, []);

  return (
    <div
      ref={tileRef}
      tabIndex={0}
      className={`group relative overflow-hidden rounded-2xl border border-line bg-panel/30 backdrop-blur-md p-3 text-left transition-all duration-300 cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:bg-panel/50 ${
        accent ? "bg-sky/15 border-sky/40 shadow-[0_0_20px_rgba(90,168,230,0.2)]" : ""
      }`}
    >
      <div className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-sky/50 to-transparent opacity-60" />
      <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-mist">
        {label}
      </dt>
      <dd className="mt-1.5 font-display text-base font-bold text-fog sm:text-lg">
        {value}
      </dd>
    </div>
  );
}
