"use client";

import { useEffect, useRef, ReactNode, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function TransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const svgOverlayRef = useRef<SVGSVGElement>(null);
  const svgPathRef = useRef<SVGPathElement>(null);
  const svgAccentPathRef = useRef<SVGPathElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const isTransitioning = useRef(false);
  const isFirstMount = useRef(true);

  // Animate curve out (reveal new page content from top)
  const animateReveal = useCallback(() => {
    if (typeof window === "undefined") return;
    const path = svgPathRef.current;
    const accent = svgAccentPathRef.current;
    const badge = badgeRef.current;
    const content = contentRef.current;

    if (!path) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (content) gsap.set(content, { autoAlpha: 1, y: 0 });
      if (path) path.setAttribute("d", "M 0 0 V 0 Q 50 0 100 0 V 0 z");
      if (accent) accent.setAttribute("d", "M 0 0 Q 50 0 100 0");
      if (badge) gsap.set(badge, { autoAlpha: 0 });
      ScrollTrigger.refresh();
      return;
    }

    const state = { val: 100, cp: 100 };

    if (badge) {
      gsap.to(badge, { autoAlpha: 0, scale: 0.8, duration: 0.25, ease: "power2.in" });
    }

    gsap.to(state, {
      val: 0,
      cp: 0,
      duration: 0.65,
      ease: "power4.inOut",
      onUpdate: () => {
        const d = `M 0 0 V ${state.val} Q 50 ${state.cp} 100 ${state.val} V 0 z`;
        path.setAttribute("d", d);
        if (accent) {
          accent.setAttribute("d", `M 0 ${state.val} Q 50 ${state.cp} 100 ${state.val}`);
        }
      },
      onComplete: () => {
        isTransitioning.current = false;
        ScrollTrigger.refresh();
      },
    });

    if (content) {
      gsap.fromTo(
        content,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out", delay: 0.15 }
      );
    }
  }, []);

  // Animate curve in (cover screen from bottom before navigation)
  const animateCover = useCallback(
    (targetUrl: string) => {
      if (typeof window === "undefined") return;
      if (isTransitioning.current) return;
      isTransitioning.current = true;

      const path = svgPathRef.current;
      const accent = svgAccentPathRef.current;
      const badge = badgeRef.current;

      if (!path) {
        router.push(targetUrl);
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(targetUrl);
        return;
      }

      const state = { val: 100, cp: 100 };

      if (badge) {
        gsap.fromTo(
          badge,
          { autoAlpha: 0, scale: 0.8 },
          { autoAlpha: 1, scale: 1, duration: 0.35, delay: 0.15, ease: "back.out(1.5)" }
        );
      }

      gsap.to(state, {
        val: 0,
        cp: 0,
        duration: 0.5,
        ease: "power4.inOut",
        onUpdate: () => {
          const d = `M 0 100 V ${state.val} Q 50 ${state.cp} 100 ${state.val} V 100 z`;
          path.setAttribute("d", d);
          if (accent) {
            accent.setAttribute("d", `M 0 ${state.val} Q 50 ${state.cp} 100 ${state.val}`);
          }
        },
        onComplete: () => {
          router.push(targetUrl);
        },
      });
    },
    [router]
  );

  // Intercept click on internal links
  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");

      if (
        !anchor ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const url = new URL(anchor.href, window.location.href);
      if (
        url.origin !== window.location.origin ||
        (url.pathname === window.location.pathname && url.search === window.location.search)
      ) {
        return;
      }

      event.preventDefault();
      animateCover(`${url.pathname}${url.search}${url.hash}`);
    };

    document.addEventListener("click", onDocumentClick, true);
    return () => document.removeEventListener("click", onDocumentClick, true);
  }, [animateCover]);

  // Route change effect
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isFirstMount.current) {
      isFirstMount.current = false;
      const content = contentRef.current;
      if (content) {
        gsap.fromTo(
          content,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.05 }
        );
      }
      return;
    }

    animateReveal();
  }, [pathname, animateReveal]);

  return (
    <>
      {/* SVG Morphing Transition Curtain */}
      <div
        className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden"
        aria-hidden="true"
      >
        <svg
          ref={svgOverlayRef}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id="svgTransGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--ink-deep)" />
              <stop offset="50%" stopColor="var(--panel-elevated)" />
              <stop offset="100%" stopColor="var(--ink)" />
            </linearGradient>
            <linearGradient id="svgAccentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5aa8e6" stopOpacity="0" />
              <stop offset="50%" stopColor="#49bdcd" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffd72a" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Morphing Curtain Body */}
          <path
            ref={svgPathRef}
            d="M 0 100 V 100 Q 50 100 100 100 V 100 z"
            fill="url(#svgTransGrad)"
          />

          {/* Glowing Atmospheric Ridge Line */}
          <path
            ref={svgAccentPathRef}
            d="M 0 100 Q 50 100 100 100"
            fill="none"
            stroke="url(#svgAccentGrad)"
            strokeWidth="0.75"
          />
        </svg>

        {/* Center Floating Atmosphere Indicator */}
        <div
          ref={badgeRef}
          className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none"
        >
          <div className="flex items-center gap-3 rounded-full border border-sky/30 bg-panel/80 px-6 py-3 shadow-[0_0_30px_rgba(90,168,230,0.3)] backdrop-blur-2xl">
            <span className="size-2 rounded-full bg-cyan animate-ping" />
            <span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-fog">
              Nimbus Atmosphere
            </span>
          </div>
        </div>
      </div>

      <div ref={contentRef} className="page-content min-h-full flex flex-col flex-1">
        {children}
      </div>
    </>
  );
}
