"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { api, type BannerApi } from "@/lib/api";
import { cn } from "@/utils";

const SLIDE_MS = 6000;

export default function HeroSlider() {
  const [slides, setSlides] = useState<BannerApi[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    api
      .publicHeroBanners()
      .then((items) => {
        if (items.length) {
          setSlides(items);
          setIdx(0);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;

    const timer = setInterval(
      () => setIdx((current) => (current + 1) % slides.length),
      SLIDE_MS,
    );

    return () => clearInterval(timer);
  }, [slides.length]);

  const slideCount = slides.length;
  const slide = slides[idx] ?? slides[0];
  const prev = () =>
    setIdx((current) => (current - 1 + slideCount) % slideCount);
  const next = () => setIdx((current) => (current + 1) % slideCount);

  if (!slide) {
    return (
      <section className="min-h-screen animate-pulse bg-primary-950" />
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-primary-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full object-cover object-top"
          />
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-primary-950/80 via-transparent to-primary-950/10" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-primary-950/50 via-transparent to-transparent" />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${slide.id}-caption`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.45 }}
          className="absolute bottom-20 left-4 z-20 max-w-[calc(100%-2rem)] sm:bottom-24 sm:left-10 lg:left-16"
        >
          <div className="max-w-md [text-shadow:0_2px_18px_rgba(0,0,0,0.85)]">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-secondary-light sm:text-[10px]">
              <span className="h-px w-7 bg-secondary-light" />
              {slide.eyebrow || "Premium Textile Collection"}
            </div>

            <h1 className="mt-3 font-display text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
              {slide.title}
              {slide.highlight && (
                <span className="ml-2 text-secondary-light">{slide.highlight}</span>
              )}
            </h1>

            {(slide.subtitle || slide.description) && (
              <p className="mt-3 line-clamp-2 max-w-sm text-xs font-medium leading-5 text-white/80 sm:text-sm">
                {slide.subtitle || slide.description}
              </p>
            )}

            <Link
              href={slide.ctaHref}
              target={slide.ctaHref.startsWith("http") ? "_blank" : undefined}
              rel={slide.ctaHref.startsWith("http") ? "noreferrer" : undefined}
              className="group mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-primary-950 transition-all hover:bg-secondary-light"
            >
              {slide.ctaLabel}
              <FaArrowRight className="h-2.5 w-2.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {slideCount > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-primary-950/35 text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-white hover:text-primary-950 sm:grid lg:bottom-6 lg:left-auto lg:right-20 lg:top-auto lg:translate-y-0"
          >
            <FaChevronLeft className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-primary-950/35 text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-white hover:text-primary-950 sm:grid lg:bottom-6 lg:right-6 lg:top-auto lg:translate-y-0"
          >
            <FaChevronRight className="h-3.5 w-3.5" />
          </button>

          <div className="absolute inset-x-4 bottom-4 z-30 flex items-center justify-between sm:inset-x-10 sm:bottom-6 lg:inset-x-16">
            <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-primary-950/35 px-3 py-2 backdrop-blur-md">
              {slides.map((item, slideIndex) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIdx(slideIndex)}
                  aria-label={`Go to slide ${slideIndex + 1}`}
                  aria-current={slideIndex === idx ? "true" : undefined}
                  className={cn(
                    "relative h-1.5 overflow-hidden rounded-full bg-white/25 transition-all duration-500",
                    slideIndex === idx ? "w-9 sm:w-12" : "w-1.5",
                  )}
                >
                  {slideIndex === idx && (
                    <motion.span
                      key={`progress-${idx}`}
                      className="absolute inset-y-0 left-0 rounded-full bg-secondary-light"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-primary-950/35 p-1.5 pl-3 backdrop-blur-md sm:hidden">
              <span className="font-mono text-[10px] text-white/60">
                <strong className="text-white">
                  {String(idx + 1).padStart(2, "0")}
                </strong>
                {` / ${String(slideCount).padStart(2, "0")}`}
              </span>
              <button
                type="button"
                onClick={next}
                aria-label="Next slide"
                className="grid h-8 w-8 place-items-center rounded-full bg-white text-primary-950 active:scale-95"
              >
                <FaChevronRight className="h-2.5 w-2.5" />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
