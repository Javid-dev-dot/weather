"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";

type TransitionLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function TransitionLink({
  href,
  children,
  className,
  onClick,
}: TransitionLinkProps) {
  const router = useRouter();
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick?.();

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      router.push(href);
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        router.push(href);
      },
    });

    tl.to(linkRef.current, {
      scale: 0.96,
      duration: 0.25,
    }).to(linkRef.current, {
      scale: 1,
      duration: 0.25,
    });
  };

  return (
    <Link
      ref={linkRef}
      href={href}
      onClick={handleClick}
      className={className}
    >
      {children}
    </Link>
  );
}
