"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaTags, FaTimes, FaWhatsapp } from "react-icons/fa";

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
          className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-ink/60 p-3 backdrop-blur-sm sm:p-4"
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
            className="relative my-4 w-full max-w-md overflow-hidden rounded-lg border border-primary-100 bg-white shadow-warm sm:max-w-lg"
          >
            <button
              type="button"
              onClick={() => {
                dismiss();
                setVisible(false);
              }}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-lg bg-white/95 text-primary-900 shadow-soft transition hover:bg-primary-50 hover:text-primary-700"
            >
              <FaTimes className="h-3.5 w-3.5" />
            </button>

            <div className="relative h-44 overflow-hidden bg-primary-950 sm:h-52">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-primary-950/20 to-transparent" />

              <div className="absolute bottom-4 left-4 right-14 inline-flex w-fit max-w-[calc(100%-4.5rem)] items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white shadow-soft">
                <FaTags className="h-3 w-3" />
                <span className="truncate">{card.badge || "Opening offer"}</span>
              </div>
            </div>

            <div className="bg-white p-5 sm:p-6">
              <div className="text-[10px] font-bold uppercase tracking-widest text-secondary-dark">
                {card.title}
              </div>

              <h2 className="mt-2 text-2xl font-extrabold leading-tight text-primary-950 sm:text-3xl">
                {card.subtitle || card.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink-muted">
                {card.description}
              </p>

              <div className="mt-5 grid gap-2">
                {[
                  "Retail and wholesale support",
                  "Quick WhatsApp enquiry",
                  "Store and delivery assistance",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-lg bg-primary-50 px-3 py-2 text-sm font-bold text-primary-950"
                  >
                    <span className="h-2 w-2 rounded-full bg-secondary" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                <Link
                  href={card.ctaHref}
                  onClick={() => {
                    dismiss();
                    setVisible(false);
                  }}
                  className="inline-flex min-w-0 items-center justify-center rounded-lg bg-primary-600 px-5 py-3 text-center text-sm font-bold text-white shadow-soft transition hover:bg-primary-700"
                >
                  <span className="truncate">{card.ctaLabel}</span>
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
                  WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => {
                    dismiss();
                    setVisible(false);
                  }}
                  className="inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-bold text-primary-800 transition hover:bg-primary-50 sm:px-3"
                >
                  Later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
