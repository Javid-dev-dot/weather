"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlass, ArrowUpRight } from "@phosphor-icons/react";
import { gsap } from "@/lib/gsap";

type Props = {
  initial?: string;
  size?: "hero" | "nav";
};

export default function CitySearch({ initial = "", size = "hero" }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const ctx = gsap.context(() => undefined, form);

    const onFocus = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.to(form, {
        borderColor: "var(--sky)",
        boxShadow: "0 0 0 3px rgba(90, 168, 230, 0.3), 0 20px 40px -15px rgba(0, 0, 0, 0.5)",
        duration: 0.35,
        ease: "power2.out",
      });
    };

    const onBlur = () => {
      gsap.to(form, {
        borderColor: "var(--line)",
        boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.3)",
        duration: 0.4,
        ease: "power3.out",
      });
    };

    form.addEventListener("focusin", onFocus);
    form.addEventListener("focusout", onBlur);

    return () => {
      ctx.revert();
      form.removeEventListener("focusin", onFocus);
      form.removeEventListener("focusout", onBlur);
      gsap.killTweensOf(form);
    };
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const city = value.trim();
    if (!city) return;
    router.push(`/forecast/${encodeURIComponent(city)}`);
  }

  const isHero = size === "hero";

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className={`group relative flex w-full items-center gap-2 rounded-full border border-line bg-[var(--panel-elevated)]/85 p-1.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-2xl transition-all duration-300 ${
        isHero ? "max-w-xl" : "max-w-md"
      }`}
    >
      <label htmlFor={`search-${size}`} className="sr-only">
        Search any global city or coordinates
      </label>

      <span className="flex size-10 items-center justify-center rounded-full bg-white/5 text-mist">
        <MagnifyingGlass
          weight="bold"
          className="size-4 text-sky"
        />
      </span>

      <input
        ref={inputRef}
        id={`search-${size}`}
        type="text"
        name="city"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search city, e.g. Tokyo, Reykjavik, Zurich..."
        autoComplete="off"
        className="min-w-0 flex-1 bg-transparent px-2 text-sm font-medium text-fog placeholder:text-mist/70 outline-none sm:text-base"
      />

      <button
        ref={btnRef}
        type="submit"
        className="group/btn relative inline-flex shrink-0 items-center gap-2 rounded-full bg-sky px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink shadow-[0_4px_16px_rgba(90,168,230,0.4)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_24px_rgba(90,168,230,0.6)] active:scale-[0.98]"
      >
        <span>Explore</span>
        <span className="flex size-6 items-center justify-center rounded-full bg-ink/15 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5">
          <ArrowUpRight weight="bold" className="size-3.5" />
        </span>
      </button>
    </form>
  );
}
