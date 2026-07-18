"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaBoxes, FaStore, FaTags, FaTruckMoving } from "react-icons/fa";

interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

export default function StatsCounter({
  items,
  light = false,
  compact = false,
}: {
  items: Stat[];
  light?: boolean;
  compact?: boolean;
}) {
  const icons = [FaStore, FaBoxes, FaTruckMoving, FaTags];

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-4 ${compact ? "gap-2" : "gap-3"} ${
        light ? "text-white" : "text-ink"
      }`}
    >
      {items.map((item, i) => (
        <StatTile
          key={i}
          item={item}
          light={light}
          compact={compact}
          Icon={icons[i % icons.length]}
        />
      ))}
    </div>
  );
}

function StatTile({
  item,
  light,
  compact,
  Icon,
}: {
  item: Stat;
  light: boolean;
  compact: boolean;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [n, setN] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.4 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const dur = 1600;
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(item.value * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [started, item.value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={`group relative overflow-hidden rounded-lg border transition hover:-translate-y-1 ${
        compact ? "p-3 md:p-4" : "p-3 md:p-6"
      } ${
        light
          ? "border-secondary/30 bg-primary-900/80 shadow-warm"
          : "border-primary-100 bg-white shadow-soft hover:border-secondary hover:shadow-warm"
      }`}
    >
      <div
        className={`${compact ? "mb-3 pb-3" : "mb-5 pb-4"} flex items-center justify-between gap-3 border-b ${
          light ? "border-white/10" : "border-primary-100"
        }`}
      >
        <span
          className={`grid place-items-center rounded-lg text-white transition group-hover:bg-secondary ${
            compact ? "h-9 w-9" : "h-11 w-11"
          } ${
            light ? "bg-secondary" : "bg-primary-600"
          }`}
        >
          <Icon className="h-4 w-4" />
        </span>
        <span
          className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest-x ${
            light
              ? "bg-white/10 text-secondary-light"
              : "bg-primary-50 text-primary-800"
          }`}
        >
          Cloth trade
        </span>
      </div>
      <div
        className={`font-extrabold leading-none ${
          compact ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl"
        } ${
          light ? "text-secondary-light" : "text-primary-950"
        }`}
      >
        {n.toLocaleString("en-IN")}
        <span className={light ? "text-white" : "text-secondary"}>
          {item.suffix}
        </span>
      </div>
      <div
        className={`${compact ? "mt-2 text-[10px]" : "mt-3 text-xs"} font-bold uppercase leading-5 tracking-wider-x ${
          light ? "text-cream-100/70" : "text-ink-muted"
        }`}
      >
        {item.label}
      </div>
    </motion.div>
  );
}
