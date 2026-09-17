"use client";

import { useEffect, useRef } from "react";
import type { ComponentType } from "react";
import type { IconProps } from "@phosphor-icons/react";
import {
  Cloud,
  CloudFog,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Lightning,
  Moon,
  Sun,
} from "@phosphor-icons/react";
import { gsap } from "@/lib/gsap";

type Props = {
  code: number;
  isDay?: boolean;
  className?: string;
};

export default function WeatherIcon({
  code,
  isDay = true,
  className = "size-12 text-sky",
}: Props) {
  let Target: ComponentType<IconProps> = Cloud;

  if (code === 0) {
    Target = isDay ? Sun : Moon;
  } else if (code === 1 || code === 2) {
    Target = isDay ? CloudSun : CloudMoon;
  } else if (code === 3) {
    Target = Cloud;
  } else if (code === 45 || code === 48) {
    Target = CloudFog;
  } else if (code >= 51 && code <= 67) {
    Target = CloudRain;
  } else if (code >= 71 && code <= 77) {
    Target = CloudSnow;
  } else if (code >= 80 && code <= 82) {
    Target = CloudRain;
  } else if (code === 85 || code === 86) {
    Target = CloudSnow;
  } else if (code >= 95) {
    Target = Lightning;
  }

  const iconRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (isDay) {
        gsap.to(iconRef.current, {
          rotate: 360,
          duration: 18,
          repeat: -1,
          ease: "none",
        });
      } else {
        gsap.to(iconRef.current, {
          rotate: -360,
          duration: 24,
          repeat: -1,
          ease: "none",
        });
      }
    });
    return () => mm.revert();
  }, [isDay]);

  return (
    <Target
      ref={iconRef}
      weight="thin"
      className={className}
      aria-hidden
    />
  );
}
