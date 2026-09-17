"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CloudSun, List, X } from "@phosphor-icons/react";
import { gsap, useGSAP } from "@/lib/gsap";
import DayNightToggle from "./DayNightToggle";

const LINKS = [
  { href: "/", label: "Overview" },
  { href: "/forecast", label: "Global Radar" },
  { href: "/about", label: "Telemetry" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const mobileLinksRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".nav-anim-item", {
        y: -16,
        autoAlpha: 0,
        stagger: 0.06,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.15,
      });

      const nav = navRef.current;
      if (!nav) return;

      let isScrolled = false;
      const onScroll = () => {
        const scrolled = window.scrollY > 40;
        if (scrolled !== isScrolled) {
          isScrolled = scrolled;
          gsap.to(nav, {
            boxShadow: scrolled
              ? "0 24px 60px -20px rgba(0, 0, 0, 0.45), 0 0 0 1px var(--line-strong)"
              : "0 10px 30px -15px rgba(0, 0, 0, 0.25), 0 0 0 1px var(--line)",
            scale: scrolled ? 0.98 : 1,
            duration: 0.4,
            ease: "power2.out",
          });
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    });
  }, { scope: headerRef });

  useEffect(() => {
    const links = mobileLinksRef.current;
    if (!links) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const items = links.querySelectorAll<HTMLElement>(".mobile-link-item");
      if (open) {
        gsap.fromTo(
          items,
          { y: 30, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            stagger: 0.08,
            duration: 0.6,
            ease: "power3.out",
          },
        );
      }
    });

    return () => mm.revert();
  }, [open]);

  return (
    <>
      <header
        ref={headerRef}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-6"
      >
        <nav
          ref={navRef}
          className="pointer-events-auto flex h-14 w-full max-w-4xl items-center justify-between gap-3 rounded-full border border-line bg-[var(--panel)]/80 px-3 pl-5 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.4)] backdrop-blur-2xl transition-colors duration-500 md:gap-6"
        >
          {/* Brand */}
          <Link
            href="/"
            className="nav-anim-item group flex items-center gap-2.5 text-sm font-semibold tracking-tight text-fog transition-opacity hover:opacity-90"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-tr from-sky to-cyan text-ink shadow-[0_0_16px_rgba(90,168,230,0.5)] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
              <CloudSun weight="bold" className="size-4.5" />
            </span>
            <span className="font-display text-base tracking-tight">Nimbus</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-1.5 md:flex">
            {LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-anim-item relative rounded-full px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.14em] transition-all duration-300 ${
                    active
                      ? "text-fog"
                      : "text-mist hover:text-fog hover:bg-fog/5"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute inset-0 rounded-full border border-sky/40 bg-sky/15 shadow-[0_0_20px_-4px_rgba(90,168,230,0.4)]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Island */}
          <div className="nav-anim-item flex items-center gap-2.5">
            <DayNightToggle />

            <Link
              href="/forecast"
              className="group hidden items-center gap-2 rounded-full bg-sky px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink shadow-[0_10px_25px_-10px_rgba(90,168,230,0.7)] transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_15px_30px_-8px_rgba(90,168,230,0.9)] active:scale-[0.98] sm:inline-flex"
            >
              <span>Forecast</span>
              <span className="flex size-5 items-center justify-center rounded-full bg-ink/15 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-full border border-line bg-fog/5 text-fog transition-colors hover:bg-fog/10 md:hidden"
              aria-expanded={open}
              aria-label={open ? "Close navigation" : "Open navigation"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="relative size-5">
                <List
                  weight="bold"
                  className={`absolute inset-0 size-5 transition-all duration-300 ${
                    open ? "scale-50 rotate-90 opacity-0" : "opacity-100"
                  }`}
                />
                <X
                  weight="bold"
                  className={`absolute inset-0 size-5 transition-all duration-300 ${
                    open ? "opacity-100" : "scale-50 -rotate-90 opacity-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <div
        ref={mobileLinksRef}
        className={`fixed inset-0 z-40 flex flex-col justify-between bg-[var(--ink)]/95 px-6 pb-12 pt-28 text-fog backdrop-blur-3xl transition-opacity duration-500 md:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex flex-col gap-5 pt-6">
          <p className="mobile-link-item text-xs font-semibold uppercase tracking-[0.25em] text-sky">
            Navigation Menu
          </p>
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="mobile-link-item font-display text-3xl font-medium tracking-tight text-fog transition-colors hover:text-sky"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mobile-link-item flex flex-col gap-4 border-t border-line pt-6">
          <div className="flex items-center justify-between text-xs text-mist">
            <span>Atmospheric Engine v2.4</span>
            <span className="flex items-center gap-1.5 text-cyan">
              <span className="size-2 rounded-full bg-cyan animate-ping" />
              Live Feed
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
