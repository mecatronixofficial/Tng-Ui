"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
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
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString("en-IN"));
  const [display, setDisplay] = useState("0");

  useMotionValueEvent(rounded, "change", setDisplay);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, item.value, {
      duration: 1.6,
      ease: [0.33, 1, 0.68, 1],
    });
    return controls.stop;
  }, [inView, item.value, count]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`group relative flex items-center border-l-2 pl-3 transition-colors ${
        compact ? "gap-2.5 py-1" : "gap-3 py-1.5"
      } ${
        light
          ? "border-white/15 hover:border-secondary"
          : "border-primary-100 hover:border-secondary"
      }`}
    >
      <Icon
        className={`shrink-0 transition-colors ${compact ? "h-4 w-4" : "h-5 w-5"} ${
          light
            ? "text-secondary-light/70 group-hover:text-secondary-light"
            : "text-primary-300 group-hover:text-secondary"
        }`}
      />
      <div className="min-w-0">
        <div
          className={`font-extrabold leading-tight tracking-tight ${
            compact ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"
          } ${light ? "text-white" : "text-primary-950"}`}
        >
          {display}
          <span className={light ? "text-secondary-light" : "text-secondary"}>
            {item.suffix}
          </span>
        </div>
        <div
          className={`truncate text-[11px] font-semibold uppercase tracking-wider-x ${
            light ? "text-cream-100/60" : "text-ink-muted"
          }`}
        >
          {item.label}
        </div>
      </div>
    </motion.div>
  );
}
