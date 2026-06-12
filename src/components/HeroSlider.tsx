"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaArrowRight,
  FaBoxes,
  FaChevronLeft,
  FaChevronRight,
  FaPhoneAlt,
  FaStore,
  FaTags,
  FaTruckMoving,
  FaWhatsapp,
} from "react-icons/fa";

import { siteConfig } from "@/data/site";
import { api, type BannerApi, type CategoryApi } from "@/lib/api";
import { cn } from "@/utils";

const heroStats = [
  { value: "Retail", label: "Single piece shopping" },
  { value: "Wholesale", label: "Bulk shop supply" },
  { value: "Erode", label: "Textile market base" },
];

const buyerPaths = [
  {
    title: "Retail Cloths",
    text: "Daily wear and family shopping",
    href: "/products",
    Icon: FaStore,
    external: false,
  },
  {
    title: "Wholesale Cloths",
    text: "Bulk orders for shops",
    href: siteConfig.socials.whatsapp,
    Icon: FaBoxes,
    external: true,
  },
] as const;

export default function HeroSlider() {
  const [slides, setSlides] = useState<BannerApi[]>([]);
  const [idx, setIdx] = useState(0);
  const [categories, setCategories] = useState<CategoryApi[]>([]);

  useEffect(() => {
    api.publicCategories().then(setCategories).catch(() => {});
  }, []);

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
      6500,
    );
    return () => clearInterval(t);
  }, [slides.length]);

  const prev = () =>
    setIdx((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIdx((i) => (i + 1) % slides.length);

  const slide = slides[idx] ?? slides[0];
  const featuredCategories = categories.slice(0, 4);

  if (!slide) return null;

  return (
    <section className="relative overflow-hidden border-b border-primary-200 bg-stone-50">
      <div className="pointer-events-none absolute inset-0 bg-weave-light opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#9a3412,#166534,#1c1917,#c2410c)]" />

      <div className="container-x relative z-10 grid min-h-[660px] gap-8 py-10 md:py-14 lg:grid-cols-12 lg:items-center">

        {/* ── Copy column ── */}
        <div className="relative z-10 lg:col-span-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -22 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2.5 rounded-md border border-primary-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-widest-x text-primary-700 shadow-soft">
                <span className="h-2 w-2 bg-secondary" />
                <FaTags className="h-3 w-3 text-secondary" />
                {slide.eyebrow || "Retail and wholesale cloths"}
              </div>

              {/* Headline */}
              <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.02] tracking-tight text-primary-950 md:text-6xl lg:text-7xl">
                {slide.title}
                {slide.highlight && (
                  <>
                    <br />
                    <span className="text-primary-600">
                      {slide.highlight}
                    </span>
                  </>
                )}
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-ink-muted md:text-lg">
                {slide.description}
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {slide.ctaHref.startsWith("http") ? (
                  <a
                    href={slide.ctaHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-secondary px-7 py-3.5 text-sm font-bold text-white shadow-warm transition hover:bg-secondary-dark active:scale-[0.99]"
                  >
                    <FaWhatsapp className="h-4 w-4" />
                    {slide.ctaLabel}
                  </a>
                ) : (
                  <Link
                    href={slide.ctaHref}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-7 py-3.5 text-sm font-bold text-white shadow-soft transition hover:bg-primary-700 active:scale-[0.99]"
                  >
                    {slide.ctaLabel}
                    <FaArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}

                {slide.secondaryHref && (
                  <Link
                    href={slide.secondaryHref}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-200 bg-white px-7 py-3.5 text-sm font-bold text-primary-700 transition hover:border-primary-500 hover:bg-primary-50 hover:text-primary-900"
                  >
                    {slide.secondaryLabel || "View Products"}
                    <FaArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>

              {/* Stats */}
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {heroStats.map((item) => (
                  <div
                    key={item.value}
                    className="group relative overflow-hidden rounded-lg border border-primary-100 bg-white px-4 py-3.5 shadow-soft transition hover:border-primary-400"
                  >
                    <div className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary-600 transition-transform duration-300 group-hover:scale-x-100" />
                    <div className="text-sm font-black text-primary-800">{item.value}</div>
                    <div className="mt-1 text-xs leading-5 text-ink-muted">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Visual column ── */}
        <div className="relative lg:col-span-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_0.78fr]">

            {/* Main image */}
            <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-primary-200 bg-white shadow-warm">
              {/* Corner accents */}
              <div className="pointer-events-none absolute left-3 top-3 z-10 h-10 w-10 rounded-tl-lg border-l-2 border-t-2 border-primary-400" />
              <div className="pointer-events-none absolute bottom-16 right-3 z-10 h-10 w-10 rounded-br-lg border-b-2 border-r-2 border-secondary/60" />

              {/* Slide counter */}
              <div className="absolute right-4 top-4 z-20 rounded-lg bg-primary-950/60 px-2.5 py-1 text-[10px] font-bold tabular-nums text-white backdrop-blur-sm">
                {String(idx + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.03 }}
                  transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute inset-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary-950/85 via-primary-900/25 to-transparent p-5">
                    <div className="inline-flex items-center gap-2 rounded-lg bg-white/95 px-3.5 py-2.5 text-xs font-bold text-ink shadow-lg backdrop-blur-sm">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-secondary/15">
                        <FaTruckMoving className="h-3.5 w-3.5 text-secondary" />
                      </span>
                      Fast quote and despatch support
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Buyer paths + call */}
            <div className="grid gap-4">
              {buyerPaths.map(({ title, text, href, Icon, external }) => {
                const cardClass =
                  "group relative overflow-hidden rounded-lg border border-primary-100 bg-white p-4 shadow-soft transition hover:border-primary-500";
                const content = (
                  <>
                    <div className="absolute inset-x-0 top-0 h-1 bg-primary-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="relative grid h-11 w-11 place-items-center rounded-lg bg-primary-600 text-white shadow-soft transition duration-300 group-hover:bg-secondary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="relative mt-4 block text-base font-extrabold text-primary-900">
                      {title}
                    </span>
                    <span className="relative mt-1 block text-xs leading-5 text-ink-muted">
                      {text}
                    </span>
                    <span className="relative mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary-600 transition duration-200 group-hover:gap-2.5 group-hover:text-secondary">
                      Enquire <FaArrowRight className="h-3 w-3" />
                    </span>
                  </>
                );

                return external ? (
                  <a key={title} href={href} target="_blank" rel="noreferrer" className={cardClass}>
                    {content}
                  </a>
                ) : (
                  <Link key={title} href={href} className={cardClass}>
                    {content}
                  </Link>
                );
              })}

              <a
                href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
                className="group flex items-center gap-3 rounded-lg bg-primary-950 px-4 py-4 text-white shadow-soft transition hover:bg-primary-800"
              >
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-white/10 transition group-hover:bg-white/20">
                  <FaPhoneAlt className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-xs text-white/60">Call store</span>
                  <span className="block text-sm font-extrabold">{siteConfig.phone}</span>
                </span>
              </a>
            </div>
          </div>

          {/* Category grid */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {featuredCategories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group overflow-hidden rounded-lg border border-primary-100 bg-white shadow-soft transition hover:border-primary-500"
              >
                <div className="aspect-[4/3] overflow-hidden bg-primary-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="relative overflow-hidden px-3 py-2.5">
                  <div className="truncate text-xs font-extrabold text-primary-900">
                    {category.name}
                  </div>
                  <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-secondary">
                    {category.productCount} items
                  </div>
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary-600 transition-all duration-500 group-hover:w-full" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="container-x pb-7">
        <div className="flex items-center justify-between gap-5 border-t border-primary-200 pt-5">
          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Slide ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  i === idx
                    ? "w-10 bg-primary-600"
                    : "w-2 bg-primary-200 hover:bg-primary-400",
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous"
              className="grid h-10 w-10 place-items-center rounded-lg border border-primary-200 bg-white text-primary-700 shadow-soft transition hover:border-primary-400 hover:bg-primary-50 hover:text-primary-900"
            >
              <FaChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next"
              className="grid h-10 w-10 place-items-center rounded-lg border border-primary-200 bg-white text-primary-700 shadow-soft transition hover:border-primary-400 hover:bg-primary-50 hover:text-primary-900"
            >
              <FaChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
