"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
  FaQuoteLeft,
  FaShoppingBag,
  FaStar,
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
      <div className="rounded-2xl border border-primary-100 bg-white p-10 text-center">
        <FaQuoteLeft className="mx-auto h-8 w-8 text-primary-200" />
        <h3 className="mt-4 text-lg font-bold text-primary-950">No reviews yet</h3>
        <p className="mt-1 text-sm text-ink-muted">
          Retail and wholesale buyer reviews will appear here.
        </p>
      </div>
    );
  }

  const rating = Math.max(0, Math.min(5, Math.floor(Number(t.rating) || 0)));

  return (
    <div className="rounded-2xl border border-primary-100 bg-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={t.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="p-6 md:p-8"
        >
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={cn(
                  "h-3.5 w-3.5",
                  i < rating ? "text-secondary" : "text-primary-100",
                )}
              />
            ))}
          </div>

          <blockquote className="mt-4 max-w-2xl text-xl font-bold leading-snug text-primary-950 md:text-2xl">
            &ldquo;{t.review}&rdquo;
          </blockquote>

          {t.productPurchased && (
            <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-ink-muted">
              <FaShoppingBag className="h-3.5 w-3.5 text-primary-500" />
              Purchased: {t.productPurchased}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 border-t border-primary-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-primary-100 text-base font-bold text-primary-800">
                {t.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-ink">{t.name}</div>
                <div className="text-xs text-ink-muted">
                  {t.role}
                  {t.company ? ` · ${t.company}` : ""}
                </div>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
              <FaMapMarkerAlt className="h-3 w-3" />
              {t.location}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between border-t border-primary-100 px-6 py-3.5">
        <div className="flex items-center gap-1.5">
          {safeItems.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Review ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === idx
                  ? "w-6 bg-secondary"
                  : "w-1.5 bg-primary-200 hover:bg-primary-400",
              )}
            />
          ))}
        </div>
        {safeItems.length > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous"
              className="grid h-8 w-8 place-items-center rounded-full text-primary-600 transition hover:bg-primary-50"
            >
              <FaChevronLeft className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next"
              className="grid h-8 w-8 place-items-center rounded-full text-primary-600 transition hover:bg-primary-50"
            >
              <FaChevronRight className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}