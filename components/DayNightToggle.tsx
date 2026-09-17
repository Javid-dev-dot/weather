"use client";

import { useSyncExternalStore, useRef, useCallback, useEffect } from "react";
import { Sun, Moon, Sparkle } from "@phosphor-icons/react";
import { gsap } from "@/lib/gsap";

const THEME_EVENT = "nimbus-theme-change";

function subscribe(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  return () => window.removeEventListener(THEME_EVENT, callback);
}

function readTheme(): "dark" | "light" {
  try {
    const saved = localStorage.getItem("nimbus-theme") as "dark" | "light" | null;
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  } catch {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
}

function getThemeSnapshot(): "dark" | "light" {
  return typeof window === "undefined" ? "dark" : readTheme();
}

function getServerSnapshot(): "dark" | "light" {
  return "dark";
}

export default function DayNightToggle() {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, getServerSnapshot);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("nimbus-theme", nextTheme);
    window.dispatchEvent(new Event(THEME_EVENT));

    if (toggleRef.current && orbRef.current) {
      const isLight = nextTheme === "light";
      gsap.to(orbRef.current, {
        x: isLight ? 28 : 0,
        rotate: isLight ? 360 : 0,
        duration: 0.55,
        ease: "back.out(1.8)",
      });

      if (starsRef.current && cloudsRef.current) {
        gsap.to(starsRef.current, {
          opacity: isLight ? 0 : 1,
          scale: isLight ? 0.4 : 1,
          duration: 0.4,
        });
        gsap.to(cloudsRef.current, {
          opacity: isLight ? 1 : 0,
          scale: isLight ? 1 : 0.4,
          duration: 0.4,
        });
      }
    }
  }, [theme]);

  const isLight = theme === "light";

  return (
    <button
      ref={toggleRef}
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      className={`relative h-8 w-16 cursor-pointer rounded-full p-1 transition-colors duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky ${
        isLight
          ? "border border-amber/40 bg-gradient-to-r from-[#8ec5fc] to-[#e0c3fc] shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_0_12px_rgba(255,215,42,0.4)]"
          : "border border-sky/30 bg-gradient-to-r from-[#0c1c30] to-[#1f2c42] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_0_12px_rgba(90,168,230,0.2)]"
      }`}
    >
      {/* Night stars background */}
      <div
        ref={starsRef}
        className={`pointer-events-none absolute inset-0 flex items-center justify-start pl-2 text-amber transition-opacity duration-300 ${
          isLight ? "opacity-0" : "opacity-100"
        }`}
      >
        <Sparkle weight="fill" className="size-2 text-amber animate-pulse" />
        <span className="ml-1 size-1 rounded-full bg-fog/60" />
        <span className="ml-1.5 size-1.5 rounded-full bg-cyan/70" />
      </div>

      {/* Day clouds background */}
      <div
        ref={cloudsRef}
        className={`pointer-events-none absolute inset-0 flex items-center justify-end pr-2 text-white transition-opacity duration-300 ${
          isLight ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="size-2.5 rounded-full bg-white/80 shadow-sm" />
        <span className="-ml-1 size-3.5 rounded-full bg-white shadow-sm" />
        <span className="-ml-1 size-2 rounded-full bg-white/90 shadow-sm" />
      </div>

      {/* Sliding Celestial Orb */}
      <div
        ref={orbRef}
        className={`relative flex size-6 items-center justify-center rounded-full shadow-md transition-all duration-300 ${
          isLight
            ? "translate-x-7 bg-gradient-to-tr from-amber via-yellow-400 to-orange-400 text-ink shadow-[0_0_14px_rgba(255,215,42,0.9)]"
            : "translate-x-0 bg-gradient-to-tr from-fog to-sky-light text-ink-deep shadow-[0_0_10px_rgba(232,243,252,0.6)]"
        }`}
      >
        {isLight ? (
          <Sun weight="bold" className="size-3.5 text-ink-soft animate-spin" style={{ animationDuration: "16s" }} />
        ) : (
          <Moon weight="fill" className="size-3.5 text-ink-deep" />
        )}
      </div>
    </button>
  );
}
