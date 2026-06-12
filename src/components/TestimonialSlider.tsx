"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaBoxes,
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
  FaQuoteLeft,
  FaShoppingBag,
  FaStar,
  FaStore,
} from "react-icons/fa";

import type { Testimonial } from "@/types";
import { cn } from "@/utils";

export default function TestimonialSlider({ items }: { items: Testimonial[] }) {
  const [idx, setIdx] = useState(0);
  const safeItems = items.filter((item) => item && item.review && item.name);
  const t = safeItems[idx];

  useEffect(() => {
    setIdx((i) => Math.min(i, Math.max(safeItems.length - 1, 0)));
  }, [safeItems.length]);

  useEffect(() => {
    if (safeItems.length <= 1) return;
    const id = setInterval(
      () => setIdx((i) => (i + 1) % safeItems.length),
      6500,
    );
    return () => clearInterval(id);
  }, [safeItems.length]);

  const prev = () =>
    setIdx((i) => (i - 1 + safeItems.length) % safeItems.length);
  const next = () => setIdx((i) => (i + 1) % safeItems.length);

  if (!t) {
    return (
      <div className="relative rounded-lg border border-primary-100 bg-white px-6 py-10 text-center shadow-soft">
        <FaQuoteLeft className="mx-auto h-12 w-12 text-secondary/30" />
        <h3 className="mt-4 text-2xl font-extrabold text-primary-950">
          No reviews yet
        </h3>
        <p className="mt-2 text-sm text-ink-muted">
          Approved retail and wholesale cloth buyer reviews will appear here.
        </p>
      </div>
    );
  }

  const rating = Math.max(0, Math.min(5, Math.floor(Number(t.rating) || 0)));

  return (
    <div className="relative overflow-hidden rounded-lg border border-primary-100 bg-white shadow-soft">
      <div className="border-b border-primary-100 bg-primary-50 px-5 py-4 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x text-primary-800 shadow-soft">
            <FaStore className="h-3 w-3 text-primary-600" />
            Retail
            <span className="h-3 w-px bg-primary-200" />
            <FaBoxes className="h-3 w-3 text-secondary" />
            Wholesale buyers
          </div>
          <div className="flex items-center gap-1 text-secondary">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < rating ? "text-secondary" : "text-primary-100",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={t.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45 }}
          className="relative p-6 md:p-8"
        >
          <FaQuoteLeft className="absolute right-6 top-6 h-16 w-16 text-secondary/10" />

          <blockquote className="relative max-w-3xl text-2xl font-extrabold leading-snug text-primary-950 md:text-3xl">
            &ldquo;{t.review}&rdquo;
          </blockquote>

          {t.productPurchased && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-secondary/30 bg-secondary/10 px-3 py-2 text-xs font-bold text-primary-950">
              <FaShoppingBag className="h-3.5 w-3.5 text-secondary" />
              Purchased: {t.productPurchased}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-4 border-t border-primary-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-lg bg-primary-600 text-xl font-extrabold text-white shadow-soft">
                {t.name.charAt(0)}
              </div>
              <div>
                <div className="font-extrabold text-ink">{t.name}</div>
                <div className="mt-1 text-xs font-semibold text-ink-muted">
                  {t.role}
                  {t.company ? ` · ${t.company}` : ""}
                </div>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 text-xs font-bold text-primary-800">
              <FaMapMarkerAlt className="h-3.5 w-3.5 text-secondary" />
              {t.location}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between border-t border-primary-100 px-5 py-4 md:px-6">
        <div className="flex items-center gap-2">
          {safeItems.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Review ${i + 1}`}
              className={cn(
                "h-2 rounded-full transition-all",
                i === idx
                  ? "w-8 bg-secondary"
                  : "w-2 bg-primary-200 hover:bg-primary-400",
              )}
            />
          ))}
        </div>
        {safeItems.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous"
              className="grid h-10 w-10 place-items-center rounded-lg border border-primary-200 text-primary-800 transition hover:border-secondary hover:bg-secondary hover:text-white"
            >
              <FaChevronLeft className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next"
              className="grid h-10 w-10 place-items-center rounded-lg border border-primary-200 text-primary-800 transition hover:border-secondary hover:bg-secondary hover:text-white"
            >
              <FaChevronRight className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
