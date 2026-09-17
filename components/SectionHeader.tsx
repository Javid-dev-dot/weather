"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(el.querySelectorAll(".sec-line"), {
          y: 20,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: "power3.out",
        });
      });
      return () => ctx.revert();
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className={align === "center" ? "text-center" : "text-left"}>
      <p className="sec-line text-xs font-medium uppercase tracking-[0.26em] text-sky/90">
        {eyebrow}
      </p>
      <h2 className="sec-line mt-4 max-w-[16ch] font-display text-4xl tracking-tight text-fog md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="sec-line mt-4 max-w-[54ch] text-base leading-relaxed text-mist">
          {description}
        </p>
      ) : null}
    </div>
  );
}
