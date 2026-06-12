"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FaBoxes,
  FaStore,
  FaTags,
  FaTimes,
  FaTruckMoving,
  FaWhatsapp,
} from "react-icons/fa";

import { siteConfig } from "@/data/site";
import { api, type BannerApi } from "@/lib/api";
import { useUI } from "@/store";

export default function OpeningSpecialCard() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [card, setCard] = useState<BannerApi | null>(null);
  const dismissed = useUI((s) => s.openingCardDismissed);
  const dismiss = useUI((s) => s.dismissOpeningCard);

  useEffect(() => {
    setMounted(true);
    api.publicOpeningCard().then((data) => setCard(data[0] ?? null)).catch(() => {});
  }, []);

  // Open after a delay so it doesn't fight with hero animations
  useEffect(() => {
    if (!mounted || !card || dismissed) return;
    const t = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(t);
  }, [mounted, card, dismissed]);

  if (!mounted || !card) return null;
  if (pathname.startsWith("/admin")) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] grid place-items-center bg-ink/60 backdrop-blur-sm p-4"
          onClick={() => {
            dismiss();
            setVisible(false);
          }}
        >
          <motion.div
            initial={{ scale: 0.92, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 30, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative grid w-full max-w-4xl overflow-hidden rounded-lg border border-secondary/30 bg-white shadow-warm md:grid-cols-[0.92fr_1.08fr]"
          >
            <button
              type="button"
              onClick={() => {
                dismiss();
                setVisible(false);
              }}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-lg bg-white/95 text-primary-900 shadow-soft transition hover:bg-primary-50 hover:text-primary-700"
            >
              <FaTimes className="h-3.5 w-3.5" />
            </button>

            {/* Image side */}
            <div className="relative min-h-[320px] overflow-hidden bg-primary-950 md:min-h-[480px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-primary-950/25 to-primary-950/10" />

              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x text-white shadow-soft">
                <FaTags className="h-3 w-3" />
                {card.badge || "Opening cloth offer"}
              </div>

              <div className="absolute bottom-5 left-5 right-5 grid gap-3">
                <div className="rounded-lg border border-white/15 bg-white/95 p-4 text-primary-950 shadow-soft">
                  <div className="text-[10px] font-bold uppercase tracking-widest-x text-secondary">
                    Retail + Wholesale
                  </div>
                  <div className="mt-1 text-lg font-extrabold leading-tight">
                    Fresh textile deals for homes, shops and traders.
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-primary-900/90 p-3 text-white">
                    <FaStore className="h-4 w-4 text-primary-300" />
                    <div className="mt-2 text-xs font-bold">Retail cloths</div>
                  </div>
                  <div className="rounded-lg bg-secondary/95 p-3 text-white">
                    <FaBoxes className="h-4 w-4" />
                    <div className="mt-2 text-xs font-bold">Bulk supply</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="relative flex flex-col justify-center bg-cream-50 p-7 md:p-10">
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-lg border border-primary-100 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
                <FaTruckMoving className="h-3 w-3 text-secondary" />
                {card.title}
              </div>

              <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-primary-950 md:text-5xl">
                {card.subtitle}
              </h2>
              <p className="mt-4 text-sm leading-7 text-ink-muted md:text-base">
                {card.description}
              </p>

              <div className="mt-6 grid gap-2">
                {[
                  "Single piece retail shopping",
                  "Wholesale supply for shop stock",
                  "WhatsApp quote and despatch support",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-lg border border-primary-100 bg-white px-3 py-2 text-sm font-bold text-primary-950"
                  >
                    <span className="h-2 w-2 rounded-full bg-secondary" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={card.ctaHref}
                  onClick={() => {
                    dismiss();
                    setVisible(false);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-secondary"
                >
                  {card.ctaLabel}
                </Link>
                <a
                  href={siteConfig.socials.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    dismiss();
                    setVisible(false);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-secondary/30 bg-white px-5 py-3 text-sm font-bold text-secondary transition hover:bg-secondary hover:text-white"
                >
                  <FaWhatsapp className="h-4 w-4" />
                  Ask on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => {
                    dismiss();
                    setVisible(false);
                  }}
                  className="inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-bold text-primary-800 transition hover:bg-primary-50"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
