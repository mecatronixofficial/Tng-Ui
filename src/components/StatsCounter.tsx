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
}: {
  items: Stat[];
  light?: boolean;
}) {
  const icons = [FaStore, FaBoxes, FaTruckMoving, FaTags];

  return (
    <div
      className={`grid grid-cols-2 gap-3 md:grid-cols-4 ${
        light ? "text-white" : "text-ink"
      }`}
    >
      {items.map((item, i) => (
        <StatTile key={i} item={item} light={light} Icon={icons[i % icons.length]} />
      ))}
    </div>
  );
}

function StatTile({
  item,
  light,
  Icon,
}: {
  item: Stat;
  light: boolean;
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
      className={`group relative overflow-hidden rounded-lg border p-3 transition hover:-translate-y-1 md:p-6 ${
        light
          ? "border-secondary/30 bg-primary-900/80 shadow-warm"
          : "border-primary-100 bg-white shadow-soft hover:border-secondary hover:shadow-warm"
      }`}
    >
      <div
        className={`mb-5 flex items-center justify-between gap-3 border-b pb-4 ${
          light ? "border-white/10" : "border-primary-100"
        }`}
      >
        <span
          className={`grid h-11 w-11 place-items-center rounded-lg text-white transition group-hover:bg-secondary ${
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
        className={`text-4xl font-extrabold leading-none md:text-5xl ${
          light ? "text-secondary-light" : "text-primary-950"
        }`}
      >
        {n.toLocaleString("en-IN")}
        <span className={light ? "text-white" : "text-secondary"}>
          {item.suffix}
        </span>
      </div>
      <div
        className={`mt-3 text-xs font-bold uppercase leading-5 tracking-wider-x ${
          light ? "text-cream-100/70" : "text-ink-muted"
        }`}
      >
        {item.label}
      </div>
    </motion.div>
  );
}
