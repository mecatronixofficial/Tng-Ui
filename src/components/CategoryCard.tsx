"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight, FaBoxes, FaStore, FaTags } from "react-icons/fa";
import type { Category } from "@/types";

export default function CategoryCard({
  category,
  index = 0,
}: {
  category: Category;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.05 }}
    >
      <Link
        href={`/products?category=${category.slug}`}
        className="group block h-full overflow-hidden rounded-lg border border-primary-100 bg-white shadow-soft transition hover:-translate-y-1 hover:border-primary-500 hover:shadow-warm"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-primary-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={category.image}
            alt={category.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950/65 via-primary-950/10 to-transparent" />

          <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-md bg-primary-600 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest-x text-white shadow-soft">
            <FaTags className="h-3 w-3" />
            {category.productCount} items
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white/95 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-primary-900">
              <FaStore className="h-3 w-3 text-primary-600" />
              Retail
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary/95 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white">
              <FaBoxes className="h-3 w-3 text-white/80" />
              Wholesale
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-xl font-extrabold leading-tight text-primary-950 transition group-hover:text-primary-700">
            {category.name}
          </h3>
          <p className="mt-2 min-h-[48px] text-sm leading-6 text-ink-muted line-clamp-2">
            {category.description}
          </p>

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-primary-100 pt-4">
            <span className="text-[10px] font-bold uppercase tracking-widest-x text-primary-600">
              Cloth category
            </span>
            <span className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-3 py-2 text-xs font-bold text-white transition group-hover:bg-secondary">
              Shop <FaArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
