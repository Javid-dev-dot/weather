"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { CurrentWeather, DailyForecast } from "@/lib/weather";
import {
  TShirt,
  CoatHanger,
  Sunglasses,
  Umbrella,
  Sneaker,
  Sparkle,
  CheckCircle,
} from "@phosphor-icons/react";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  current: CurrentWeather;
  daily: DailyForecast[];
  city: string;
};

type StyleCategory = "commute" | "outdoor" | "athletic" | "minimal";

const CATEGORY_COPY = {
  commute: {
    kicker: "Urban Commute Protocol",
    copy: "Wind-resistant outer layers with breathable midweights for transit, walking, and rapid temperature shifts.",
  },
  outdoor: {
    kicker: "Exposure & Storm Protocol",
    copy: "Sealed shells, insulated extremities, and high-traction footwear for prolonged outdoor exposure.",
  },
  athletic: {
    kicker: "High-Output Thermoregulation",
    copy: "Moisture-wicking base layers, vented footwear, and UV protection sized to heat and precipitation risk.",
  },
  minimal: {
    kicker: "Minimal Capsule Edit",
    copy: "A restrained three-piece capsule that keeps silhouette, comfort, and weather protection in balance.",
  },
} as const;

export default function WeatherApparelAdvisory({ current, daily, city }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<StyleCategory>("commute");

  const temp = current.temp;
  const isRain = current.precip > 0.5 || (current.code >= 51 && current.code <= 82);
  const isSnow = current.code >= 71 && current.code <= 86;
  const isWindy = current.windSpeed > 25;
  const uv = daily[0]?.uv ?? 3;

  // Compute thermal condition tier
  let conditionLabel = "Temperate Comfort";
  let conditionDesc = "Mild atmospheric conditions ideal for lightweight breathable apparel.";
  let badgeColor = "text-cyan bg-cyan/10 border-cyan/30";

  if (temp <= 0 || isSnow) {
    conditionLabel = "Sub-Zero Alpine & Extreme Frost";
    conditionDesc = "Heavy insulation required. Protect extremities against thermal loss and sub-zero chill.";
    badgeColor = "text-sky bg-sky/10 border-sky/30";
  } else if (temp <= 10) {
    conditionLabel = "Crisp Cool Maritime Air";
    conditionDesc = "Structured mid-weight layering with thermal regulation for cool ambient winds.";
    badgeColor = "text-lavender bg-lavender/10 border-lavender/30";
  } else if (temp <= 22) {
    conditionLabel = "Balanced Temperate Flow";
    conditionDesc = "Optimal comfort index. Versatile cotton, technical linen, or single light knitwear.";
    badgeColor = "text-cyan bg-cyan/10 border-cyan/30";
  } else if (temp <= 30) {
    conditionLabel = "Warm Solar Exposure";
    conditionDesc = "Breathable moisture-wicking fabrics and UV ray shielding recommended.";
    badgeColor = "text-amber bg-amber/10 border-amber/30";
  } else {
    conditionLabel = "Intense Heatwave & High Thermal Index";
    conditionDesc = "Ultra-lightweight garments, active hydration, and wide-spectrum sun protection required.";
    badgeColor = "text-sunset bg-sunset/10 border-sunset/30";
  }

  // Recommendations data
  const gearItems = [
    {
      role: "Outer Shell",
      name: isRain
        ? "Hydrophobic Gore-Tex Raincoat"
        : isSnow
          ? "Heavy Down Parka & Storm Hood"
          : isWindy
            ? "Windstopper Ripstop Shell"
            : temp < 15
              ? "Tailored Wool Trench Coat"
              : "Unstructured Linen Overshirt",
      icon: CoatHanger,
      note: isRain ? "DWR 20,000mm waterproofing" : temp < 10 ? "800-fill thermal fill" : "Breathable 120gsm weave",
    },
    {
      role: "Base & Mid Layer",
      name: temp < 8
        ? "Merino Wool Thermal Knit"
        : temp < 18
          ? "Structured Heavy Cotton Crewneck"
          : "Organic Pima Cotton Tee",
      icon: TShirt,
      note: temp < 10 ? "Optimal heat-retention ratio" : "Natural moisture dispersion",
    },
    {
      role: "Footwear Choice",
      name: isRain || isSnow
        ? "Sealed Lug-Sole Combat Boots"
        : temp < 15
          ? "Leather Chelsea Boots"
          : "Vented Mesh Performance Sneakers",
      icon: Sneaker,
      note: isRain ? "Non-slip wet-surface traction" : "High arch airflow ergonomics",
    },
    {
      role: "Essential Accessory",
      name: isRain
        ? "Wind-Reinforced Compact Umbrella"
        : uv >= 6
          ? "Polarized UV400 Dark Acetate Sunglasses"
          : temp < 8
            ? "Cashmere Beanie & Insulated Gloves"
            : "Lightweight UV Cap / Shield",
      icon: isRain ? Umbrella : uv >= 5 ? Sunglasses : Sparkle,
      note: uv >= 6 ? "Blocks 99.8% UVA/UVB radiation" : isRain ? "Tested up to 60 km/h gusts" : "Zero-scratch thermal finish",
    },
  ];

  const categoryCopy = CATEGORY_COPY[activeTab];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".apparel-header-el", {
          y: 30,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
        });

        gsap.from(".apparel-card", {
          y: 40,
          scale: 0.94,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative px-4 py-24 sm:px-6 md:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Header with double bezel pill */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/40 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-lavender">
              <Sparkle weight="fill" className="size-3 text-lavender" />
              Fashion for Extreme Weather Conditions
            </div>
            <h2 className="apparel-header-el mt-4 font-display text-3xl font-bold tracking-tight text-fog md:text-5xl">
              Apparel & Lifestyle Advisory
            </h2>
            <p className="apparel-header-el mt-3 max-w-[58ch] text-base leading-relaxed text-mist">
              Dynamic attire recommendations calculated from live atmospheric pressure, ambient
              dew point, wind chill ({current.windSpeed} km/h), and current UV index ({uv}) for {city}. {conditionDesc}
            </p>
          </div>

          {/* Live Condition Highlight Badge */}
          <div className="apparel-header-el double-bezel self-start md:self-auto">
            <div className="double-bezel-inner flex items-center gap-4 px-5 py-3.5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky/20 to-lavender/30 text-fog ring-1 ring-white/10">
                <CoatHanger weight="bold" className="size-6 text-sky-light" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-mist">
                  Calculated Status
                </p>
                <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
                  {conditionLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-10 flex flex-wrap gap-2.5">
          {(
            [
              { id: "commute", label: "Daily Urban Commute" },
              { id: "outdoor", label: "Extreme Weather Trek" },
              { id: "athletic", label: "High-Output Athletic" },
              { id: "minimal", label: "Minimalist Casual" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-300 ${
                activeTab === tab.id
                  ? "border border-sky/40 bg-sky text-ink shadow-[0_4px_16px_rgba(90,168,230,0.4)] scale-[1.02]"
                  : "border border-line bg-panel/40 text-mist hover:text-fog hover:bg-panel/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="my-6 rounded-2xl border border-line bg-panel/40 p-5"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan">
              {categoryCopy.kicker}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-mist">{categoryCopy.copy}</p>
          </motion.div>
        </AnimatePresence>

        {/* 4 Double Bezel Gear Cards Grid */}
        <div className="apparel-grid mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gearItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.role}
                className="apparel-card group double-bezel transition-transform duration-500 hover:-translate-y-1.5"
              >
                <div className="double-bezel-inner flex h-full flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-mist">
                        {item.role}
                      </span>
                      <span className="flex size-7 items-center justify-center rounded-full bg-white/5 text-mist group-hover:text-sky">
                        0{idx + 1}
                      </span>
                    </div>

                    <div className="mt-6 flex size-14 items-center justify-center rounded-2xl bg-sky/10 text-sky ring-1 ring-sky/25 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-sky/20">
                      <Icon weight="light" className="size-7" />
                    </div>

                    <h3 className="mt-5 font-display text-lg font-bold text-fog group-hover:text-sky-light transition-colors">
                      {item.name}
                    </h3>
                  </div>

                  <div className="mt-6 border-t border-line pt-4">
                    <p className="flex items-center gap-2 text-xs text-mist">
                      <CheckCircle weight="fill" className="size-3.5 text-cyan shrink-0" />
                      <span>{item.note}</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
