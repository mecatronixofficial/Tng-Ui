"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaBoxes,
  FaClock,
  FaStore,
  FaTag,
  FaTruckMoving,
  FaWhatsapp,
} from "react-icons/fa";

import { siteConfig } from "@/data/site";
import type { Offer } from "@/types";

const fallbackImage =
  "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=1200&auto=format&fit=crop&q=85";

function useCountdown(target: string) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (now === null) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: false, ready: false };
  }

  const diff = Math.max(0, new Date(target).getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const minutes = Math.floor((diff / 60000) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, done: diff <= 0, ready: true };
}

export default function OfferBanner({ offer }: { offer: Offer }) {
  const cd = useCountdown(offer.expiresAt);
  const primaryHref = offer.ctaHref || "/products";
  const primaryLabel = offer.ctaLabel || "Shop Offer";
  const isExternal = primaryHref.startsWith("http");

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-2xl shadow-warm ring-1 ring-primary-800/30"
    >
      <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
        {/* ── Offer details panel ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 p-6 md:p-8 lg:p-10">
          {/* Subtle weave texture */}
          <div className="pointer-events-none absolute inset-0 bg-weave-dark opacity-60" />

          {/* Top badge */}
          <div className="relative inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-800/60 px-4 py-2 text-[10px] font-bold uppercase tracking-widest-x text-primary-200 backdrop-blur-sm">
            <FaTag className="h-3 w-3 text-secondary" />
            Cloth offer for retail and wholesale
          </div>

          <div className="relative mt-6 grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
          {/* Offer badge */}
            <div className="rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 px-5 py-4 text-white shadow-soft ring-1 ring-primary-400/20">
              <div className="text-4xl font-extrabold leading-none tracking-tight">
                Best
              </div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-widest-x text-primary-200">
                Offer
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl">
                {offer.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-primary-200">
                {offer.description}
              </p>
            </div>
          </div>

          {offer.code && (
            <div className="relative mt-6 flex max-w-md items-center justify-between rounded-xl border border-dashed border-secondary/50 bg-primary-900/50 px-4 py-3 backdrop-blur-sm">
              <span className="text-xs font-bold uppercase tracking-wider-x text-primary-300">
                Offer code
              </span>
              <span className="rounded-md bg-secondary/20 px-3 py-1 text-sm font-extrabold tracking-wider text-secondary">
                {offer.code}
              </span>
            </div>
          )}

          <div className="relative mt-6 grid gap-2 sm:grid-cols-3">
            <InfoPill Icon={FaStore} label="Retail shopping" />
            <InfoPill Icon={FaBoxes} label="Wholesale orders" />
            <InfoPill Icon={FaTruckMoving} label="Fast despatch" />
          </div>

          <div className="relative mt-7 flex flex-col gap-3 sm:flex-row">
            {isExternal ? (
              <a
                href={primaryHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-primary-400"
              >
                {primaryLabel}
                <FaArrowRight className="h-3.5 w-3.5" />
              </a>
            ) : (
              <Link
                href={primaryHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-primary-400"
              >
                {primaryLabel}
                <FaArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}

            <a
              href={siteConfig.socials.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-600/40 bg-primary-900/50 px-5 py-3 text-sm font-bold text-primary-100 backdrop-blur-sm transition hover:border-secondary hover:text-secondary"
            >
              <FaWhatsapp className="h-4 w-4" />
              Ask on WhatsApp
            </a>
          </div>
        </div>

        {/* ── Visual + timer panel ── */}
        <div className="relative min-h-[360px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={offer.image || fallbackImage}
            alt={offer.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Primary-tinted gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950/85 via-primary-900/40 to-primary-800/10" />

          {/* Top badges */}
          <div className="absolute left-5 right-5 top-5 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-400/30 bg-primary-950/70 px-3 py-2 text-xs font-extrabold text-primary-100 shadow-soft backdrop-blur-md">
              <FaClock className="h-3.5 w-3.5 text-primary-400" />
              {cd.ready && cd.done ? "Offer expired" : "Offer ending soon"}
            </div>
            <div className="rounded-full bg-secondary px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x text-white shadow-soft">
              Retail + Wholesale
            </div>
          </div>

          {/* Countdown timer */}
          <div className="absolute inset-x-5 bottom-5">
            {cd.ready && !cd.done ? (
              <div className="grid grid-cols-4 gap-2">
                {[
                  ["Days", cd.days],
                  ["Hrs", cd.hours],
                  ["Min", cd.minutes],
                  ["Sec", cd.seconds],
                ].map(([label, val]) => (
                  <div
                    key={label as string}
                    className="rounded-xl border border-primary-500/30 bg-primary-950/75 px-2 py-3 text-center shadow-soft backdrop-blur-md ring-1 ring-primary-400/10"
                  >
                    <div className="text-2xl font-extrabold leading-none text-primary-300">
                      {String(val).padStart(2, "0")}
                    </div>
                    <div className="mt-1 text-[9px] font-bold uppercase tracking-widest-x text-primary-400">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-primary-500/30 bg-primary-950/75 px-4 py-3 text-sm font-bold text-primary-100 backdrop-blur-md">
                Contact us on WhatsApp for current cloth availability.
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function InfoPill({
  Icon,
  label,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-primary-700/40 bg-primary-900/40 px-3 py-2 text-xs font-bold text-primary-100 backdrop-blur-sm">
      <Icon className="h-3.5 w-3.5 text-secondary" />
      {label}
    </div>
  );
}
