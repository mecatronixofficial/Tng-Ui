"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight, FaBoxes, FaGem, FaStore, FaTags } from "react-icons/fa";
import type { Category } from "@/types";

export default function CategoryCard({
  category,
  index = 0,
  href,
  rank,
}: {
  category: Category;
  index?: number;
  href?: string;
  rank?: number;
}) {
  const itemLabel = `${category.productCount} ${
    category.productCount === 1 ? "item" : "items"
  }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link
        href={href ?? `/products?category=${category.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/60 bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.18),0_0_0_1px_rgba(var(--color-secondary-rgb,202,138,4),0.25)]"
      >
        {/* Glow border on hover */}
        <div className="pointer-events-none absolute inset-0 z-20 rounded-2xl opacity-0 ring-1 ring-secondary/40 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Shimmer sweep */}
        <div className="pointer-events-none absolute inset-0 z-10 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

        {/* ── Image area ── */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={category.image}
            alt={category.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 via-transparent to-secondary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Premium badge */}
          <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-950 shadow-lg backdrop-blur-sm">
            <FaGem className="h-2.5 w-2.5 text-secondary" />
            Premium
          </div>

          {/* Rank badge */}
          {typeof rank === "number" && (
            <div className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/50 text-[11px] font-extrabold text-white shadow-lg backdrop-blur-sm">
              {String(rank).padStart(2, "0")}
            </div>
          )}

          {/* Bottom overlay content */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-950 shadow-md">
                  <FaTags className="h-2.5 w-2.5" />
                  {itemLabel}
                </div>
                <h3 className="text-xl font-extrabold leading-tight tracking-tight text-white drop-shadow md:text-2xl">
                  {category.name}
                </h3>
              </div>

              {/* Arrow CTA */}
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/30 bg-white/20 text-white shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:bg-secondary group-hover:text-primary-950 group-hover:shadow-[0_0_20px_rgba(202,138,4,0.5)]">
                <FaArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </div>

        {/* ── Card body ── */}
        <div className="relative flex flex-1 flex-col p-5">
          {/* Accent line */}
          <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
          {/* Tags row */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <span className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-primary-100 bg-primary-50/80 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-primary-700 transition-colors duration-200 group-hover:border-primary-200 group-hover:bg-primary-100">
              <FaStore className="h-3 w-3 text-secondary" />
              Retail
            </span>
            <span className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-secondary/20 bg-secondary/8 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-secondary-dark transition-colors duration-200 group-hover:border-secondary/40 group-hover:bg-secondary/15">
              <FaBoxes className="h-3 w-3" />
              Wholesale
            </span>
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-primary-100/70 pt-3.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-400">
              Cloth category
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-primary-800 transition-all duration-300 group-hover:gap-2.5 group-hover:text-secondary-dark">
              Explore <FaArrowRight className="h-2.5 w-2.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
