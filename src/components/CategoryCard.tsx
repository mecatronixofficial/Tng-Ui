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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.05 }}
      className="h-full"
    >
      <Link
        href={href ?? `/products?category=${category.slug}`}
        className="group relative block h-full overflow-hidden rounded-lg border border-primary-100/80 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:border-secondary/70 hover:shadow-warm"
      >
        <div className="pointer-events-none absolute inset-0 z-10 opacity-0 transition duration-500 group-hover:opacity-100">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/80 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-primary-300 to-transparent" />
        </div>

        <div className="relative aspect-[4/3] overflow-hidden bg-primary-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={category.image}
            alt={category.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950/85 via-primary-900/20 to-white/5" />
          <div className="absolute inset-0 bg-weave-dark opacity-0 mix-blend-screen transition duration-500 group-hover:opacity-35" />

          <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-md border border-white/25 bg-white/95 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest-x text-primary-950 shadow-soft backdrop-blur">
            <FaGem className="h-3 w-3 text-secondary" />
            Premium
          </div>

          {typeof rank === "number" && (
            <div className="absolute right-3 top-3 rounded-md border border-white/20 bg-primary-950/70 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest-x text-white shadow-soft backdrop-blur">
              {String(rank).padStart(2, "0")}
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 rounded-md bg-secondary px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest-x text-primary-950 shadow-soft">
                  <FaTags className="h-3 w-3" />
                  {itemLabel}
                </div>
                <h3 className="mt-3 text-xl font-extrabold leading-tight text-white drop-shadow-sm md:text-2xl">
                  {category.name}
                </h3>
              </div>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-white/25 bg-white/95 text-primary-900 shadow-soft transition group-hover:bg-secondary group-hover:text-primary-950">
                <FaArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </div>

        <div className="relative p-5">
          <p className="min-h-[48px] text-sm leading-6 text-ink-muted line-clamp-2">
            {category.description}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <span className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary-50 px-2.5 py-2 text-[10px] font-bold uppercase tracking-wide text-primary-800">
              <FaStore className="h-3 w-3 text-secondary" />
              Retail
            </span>
            <span className="inline-flex items-center justify-center gap-1.5 rounded-md bg-secondary/10 px-2.5 py-2 text-[10px] font-bold uppercase tracking-wide text-secondary-dark">
              <FaBoxes className="h-3 w-3" />
              Wholesale
            </span>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-primary-100 pt-4">
            <span className="text-[10px] font-bold uppercase tracking-widest-x text-primary-600">
              Cloth category
            </span>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary-900 transition group-hover:text-secondary-dark">
              Explore <FaArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
