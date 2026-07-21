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

  const close = () => {
    dismiss();
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end justify-center overflow-y-auto bg-ink/70 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.95, y: 60, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 40, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-t-3xl bg-gradient-to-br from-secondary/60 via-primary-300/40 to-secondary/60 p-[1.5px] shadow-warm sm:max-w-lg sm:rounded-3xl"
          >
            <div className="no-scrollbar max-h-[92vh] overflow-y-auto rounded-t-[calc(1.5rem-1.5px)] bg-white sm:max-h-[85vh] sm:rounded-[calc(1.5rem-1.5px)]">
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-primary-900 shadow-soft backdrop-blur transition hover:bg-white hover:text-primary-700 active:scale-95"
              >
                <FaTimes className="h-4 w-4" />
              </button>

              <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-primary-200 sm:hidden" />

              <div className="relative mt-2 h-36 overflow-hidden bg-primary-950 xs:h-44 sm:mt-0 sm:h-52">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image}
                  alt={card.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/85 via-primary-950/25 to-transparent" />

                <div className="absolute bottom-3 left-3 right-14 inline-flex w-fit max-w-[calc(100%-4.5rem)] items-center gap-2 overflow-hidden rounded-full bg-secondary px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-soft">
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent bg-[length:200%_100%] animate-shimmer" />
                  <FaTags className="h-3 w-3 shrink-0" />
                  <span className="truncate">{card.badge || "Opening offer"}</span>
                </div>
              </div>

              <div className="p-4 xs:p-5 sm:p-6">
                <div className="text-[10px] font-bold uppercase tracking-widest text-secondary-dark">
                  {card.title}
                </div>

                <h2 className="mt-1.5 text-xl font-extrabold leading-tight text-primary-950 xs:text-2xl sm:text-3xl">
                  {card.subtitle || card.title}
                </h2>
                <p className="mt-2.5 text-sm leading-6 text-ink-muted">
                  {card.description}
                </p>

                <div className="mt-4 grid gap-2 sm:mt-5">
                  {[
                    "Retail and wholesale support",
                    "Quick WhatsApp enquiry",
                    "Store and delivery assistance",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl bg-primary-50 px-3 py-2 text-xs font-bold text-primary-950 xs:text-sm"
                    >
                      <span className="h-2 w-2 shrink-0 rounded-full bg-secondary" />
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-2.5 sm:mt-7">
                  <Link
                    href={card.ctaHref}
                    onClick={close}
                    className="inline-flex min-w-0 items-center justify-center rounded-xl bg-primary-600 px-5 py-3.5 text-center text-sm font-bold text-white shadow-soft transition hover:bg-primary-700 hover:shadow-warm active:scale-[0.98] sm:py-3"
                  >
                    <span className="truncate">{card.ctaLabel}</span>
                  </Link>
                  <div className="grid grid-cols-2 gap-2.5">
                    <a
                      href={siteConfig.socials.whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      onClick={close}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-secondary/30 bg-white px-4 py-3 text-xs font-bold text-secondary transition hover:bg-secondary hover:text-white active:scale-[0.98] xs:text-sm"
                    >
                      <FaWhatsapp className="h-4 w-4 shrink-0" />
                      WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={close}
                      className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-xs font-bold text-primary-800 transition hover:bg-primary-50 active:scale-[0.98] xs:text-sm"
                    >
                      Later
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
