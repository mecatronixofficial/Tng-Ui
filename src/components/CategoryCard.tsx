"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import type { Category } from "@/types";

export default function CategoryCard({
  category,
  index = 0,
  href,
}: {
  category: Category;
  index?: number;
  href?: string;
  rank?: number;
}) {
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
        className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-stone-900 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.55)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_45px_-18px_rgba(0,0,0,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-600"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={category.image}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/5 transition-opacity duration-500 group-hover:from-black/95" />

        <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-white/10 text-xs font-semibold tracking-wider text-white backdrop-blur-md">
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
            Wholesale collection
          </p>
          <div className="flex items-end justify-between gap-3">
            <h3 className="line-clamp-2 text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
            {category.name}
            </h3>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-lg text-stone-900 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:bg-amber-500 group-hover:text-white">
              <FiArrowUpRight aria-hidden="true" />
              <span className="sr-only">View {category.name}</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
