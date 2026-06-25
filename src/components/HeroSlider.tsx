"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaWhatsapp,
} from "react-icons/fa";

import { api, type BannerApi } from "@/lib/api";
import { cn } from "@/utils";

const SLIDE_MS = 6500;

const heroStats = [
  { value: "Retail", label: "Single piece" },
  { value: "Wholesale", label: "Bulk supply" },
  { value: "Erode", label: "Market base" },
];

const stagger = {
  container: {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
    exit: { transition: { duration: 0.25 } },
  },
  item: {
    hidden: { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: { opacity: 0, y: -14, transition: { duration: 0.25 } },
  },
};

export default function HeroSlider() {
  const [slides, setSlides] = useState<BannerApi[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    api
      .publicHeroBanners()
      .then((items) => {
        if (items.length > 0) {
          setSlides(items);
          setIdx(0);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(
      () => setIdx((i) => (i + 1) % slides.length),
      SLIDE_MS,
    );
    return () => clearInterval(t);
  }, [slides.length]);

  const displaySlides = slides;
  const slideCount = displaySlides.length;
  const prev = () => setIdx((i) => (i - 1 + slideCount) % slideCount);
  const next = () => setIdx((i) => (i + 1) % slideCount);
  const slide = displaySlides[idx] ?? displaySlides[0];

  if (!slide) {
    return (
      <section className="relative mx-auto min-h-[560px] overflow-hidden bg-primary-950 sm:min-h-[calc(100svh-6.75rem)]" />
    );
  }

  return (
    <section className="relative mx-auto min-h-[560px] overflow-hidden bg-primary-950 sm:min-h-[calc(100svh-6.75rem)]">
      {/* ── Background image ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id + "-bg"}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 z-[11] bg-gradient-to-t from-primary-950/85 via-primary-950/25 to-primary-950/20 sm:from-primary-950/70 sm:via-transparent sm:to-transparent" />

      {/* ── Content ── */}
      <div className="relative z-20 flex min-h-[560px] items-end px-4 pb-28 pt-20 sm:min-h-[calc(100svh-6.75rem)] sm:items-center sm:px-10 sm:py-20 lg:px-16 xl:px-24">
        <div className="w-full max-w-lg sm:max-w-xl xl:max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + "-content"}
              variants={stagger.container}
              initial="hidden"
              animate="show"
              exit="exit"
              className="drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)]"
            >
              <motion.div variants={stagger.item}>
                <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-secondary backdrop-blur-sm sm:gap-2.5 sm:px-4 sm:text-[11px] sm:tracking-[0.18em]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary" />
                  <span className="truncate">
                    {slide.eyebrow || "Retail & Wholesale Cloths"}
                  </span>
                </span>
              </motion.div>

              <motion.h1
                variants={stagger.item}
                className="mt-4 max-w-3xl font-display text-3xl font-black leading-[1.06] tracking-tight text-white sm:mt-5 sm:text-5xl lg:text-6xl xl:text-7xl"
              >
                {slide.title}
                {slide.highlight && (
                  <>
                    <br />
                    <span className="bg-gradient-to-r from-secondary to-secondary-light bg-clip-text text-transparent">
                      {slide.highlight}
                    </span>
                  </>
                )}
              </motion.h1>

              <motion.div
                variants={stagger.item}
                className="mt-6 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap"
              >
                {slide.ctaHref.startsWith("http") ? (
                  <a
                    href={slide.ctaHref}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg bg-secondary px-5 py-3 text-sm font-bold text-white shadow-warm transition-all duration-300 hover:scale-[1.02] hover:bg-secondary-dark active:scale-[0.98] sm:px-6 sm:py-3.5"
                  >
                    <FaWhatsapp className="h-4 w-4" />
                    {slide.ctaLabel}
                    <FaArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                ) : (
                  <Link
                    href={slide.ctaHref}
                    className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg bg-white px-5 py-3 text-sm font-bold text-primary-900 shadow-soft transition-all duration-300 hover:scale-[1.02] hover:bg-primary-50 active:scale-[0.98] sm:px-6 sm:py-3.5"
                  >
                    {slide.ctaLabel}
                    <FaArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                )}

                {slide.secondaryHref && (
                  <Link
                    href={slide.secondaryHref}
                    className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/20 sm:px-6 sm:py-3.5"
                  >
                    {slide.secondaryLabel || "View Products"}
                    <FaArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                )}
              </motion.div>

              <motion.div
                variants={stagger.item}
                className="mt-6 grid grid-cols-3 gap-2 sm:mt-10 sm:flex sm:flex-wrap"
              >
                {heroStats.map((item) => (
                  <div
                    key={item.value}
                    className="min-w-0 rounded-xl border border-white/[0.12] bg-white/[0.07] px-2.5 py-2 backdrop-blur-md sm:flex sm:items-center sm:gap-2.5 sm:rounded-2xl sm:px-4 sm:py-2.5"
                  >
                    <span className="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-secondary sm:block" />
                    <span className="block min-w-0">
                      <span className="block truncate text-xs font-black text-white sm:text-sm">
                        {item.value}
                      </span>
                      <span className="block truncate text-[9px] font-semibold uppercase tracking-wider text-white/45 sm:text-[10px]">
                        {item.label}
                      </span>
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Bottom bar: dots + counter + nav ── */}
        <div className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-between px-4 pb-5 sm:items-end sm:px-10 sm:pb-8 lg:px-16 xl:px-24">
          <div className="flex items-center gap-1.5">
            {displaySlides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Slide ${i + 1}`}
                className={cn(
                  "relative overflow-hidden rounded-full bg-white/25 transition-all duration-500",
                  i === idx ? "h-[3px] w-8 sm:w-10" : "h-[3px] w-[6px]",
                )}
              >
                {i === idx && (
                  <motion.div
                    key={`prog-${idx}`}
                    className="absolute inset-y-0 left-0 rounded-full bg-white"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden font-mono text-[11px] tabular-nums min-[380px]:inline">
              <span className="font-bold text-white/80">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="text-white/35">
                {" "}
                / {String(slideCount).padStart(2, "0")}
              </span>
            </span>
            <div className="flex gap-1.5">
              {[
                { fn: prev, Icon: FaChevronLeft, label: "Previous slide" },
                { fn: next, Icon: FaChevronRight, label: "Next slide" },
              ].map(({ fn, Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  onClick={fn}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-white/45 hover:bg-white/20 hover:text-white active:scale-95 sm:h-10 sm:w-10"
                >
                  <Icon className="h-3 w-3" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
