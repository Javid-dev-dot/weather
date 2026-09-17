"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if device has touch only or user prefers reduced motion
    const isTouch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isTouch || prefersReduced) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;
    if (!dot || !ring || !glow) return;

    // Set initial off-screen
    gsap.set([dot, ring, glow], { xPercent: -50, yPercent: -50, opacity: 0 });

    const xToDot = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
    const yToDot = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });

    const xToRing = gsap.quickTo(ring, "x", { duration: 0.38, ease: "power3.out" });
    const yToRing = gsap.quickTo(ring, "y", { duration: 0.38, ease: "power3.out" });

    const xToGlow = gsap.quickTo(glow, "x", { duration: 0.55, ease: "power3.out" });
    const yToGlow = gsap.quickTo(glow, "y", { duration: 0.55, ease: "power3.out" });

    let isVisible = false;
    let isHovering = false;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;

      if (!isVisible) {
        isVisible = true;
        gsap.to([dot, ring, glow], { opacity: 1, duration: 0.3 });
      }

      xToDot(x);
      yToDot(y);
      xToRing(x);
      yToRing(y);
      xToGlow(x);
      yToGlow(y);

      // Check hovered element
      const target = e.target as HTMLElement | null;
      const isInteractive = Boolean(
        target?.closest("a, button, input, textarea, [data-cursor], .hourly-bar-col, .gauge-card, .apparel-card, .city-dest-card, .forecast-card")
      );

      if (isInteractive && !isHovering) {
        isHovering = true;
        gsap.to(ring, {
          scale: 1.8,
          borderColor: "rgba(90, 168, 230, 0.8)",
          backgroundColor: "rgba(90, 168, 230, 0.12)",
          duration: 0.35,
          ease: "back.out(1.7)",
        });
        gsap.to(dot, {
          scale: 0.5,
          backgroundColor: "#ffd72a",
          duration: 0.25,
        });
        gsap.to(glow, {
          scale: 1.4,
          opacity: 0.8,
          duration: 0.35,
        });
      } else if (!isInteractive && isHovering) {
        isHovering = false;
        gsap.to(ring, {
          scale: 1,
          borderColor: "rgba(90, 168, 230, 0.4)",
          backgroundColor: "transparent",
          duration: 0.4,
          ease: "power2.out",
        });
        gsap.to(dot, {
          scale: 1,
          backgroundColor: "#5aa8e6",
          duration: 0.3,
        });
        gsap.to(glow, {
          scale: 1,
          opacity: 0.4,
          duration: 0.4,
        });
      }
    };

    const onMouseDown = () => {
      gsap.to(ring, { scale: 0.85, duration: 0.15, ease: "power2.out" });
      gsap.to(dot, { scale: 1.4, duration: 0.15, ease: "power2.out" });
    };

    const onMouseUp = () => {
      gsap.to(ring, { scale: isHovering ? 1.8 : 1, duration: 0.3, ease: "back.out(1.5)" });
      gsap.to(dot, { scale: isHovering ? 0.5 : 1, duration: 0.3 });
    };

    const onMouseLeave = () => {
      isVisible = false;
      gsap.to([dot, ring, glow], { opacity: 0, duration: 0.3 });
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9997] overflow-hidden"
      aria-hidden="true"
    >
      {/* Soft atmospheric glow follower */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute left-0 top-0 size-32 rounded-full bg-gradient-to-tr from-sky/20 via-cyan/25 to-transparent blur-xl opacity-0 transition-opacity"
      />

      {/* Outer kinetic magnetic ring */}
      <div
        ref={ringRef}
        className="pointer-events-none absolute left-0 top-0 size-10 rounded-full border border-sky/40 backdrop-blur-[1px] shadow-[0_0_15px_rgba(90,168,230,0.25)] opacity-0"
      />

      {/* Central luminous core dot */}
      <div
        ref={dotRef}
        className="pointer-events-none absolute left-0 top-0 size-2.5 rounded-full bg-sky shadow-[0_0_10px_2px_rgba(90,168,230,0.9)] opacity-0"
      />
    </div>
  );
}
