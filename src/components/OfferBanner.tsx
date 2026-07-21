"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaBoxes,
  FaClock,
  FaCut,
  FaStore,
  FaTag,
  FaTicketAlt,
  FaTruckMoving,
  FaWhatsapp,
} from "react-icons/fa";

import { siteConfig } from "@/data/site";
import type { Offer } from "@/types";

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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl shadow-warm ring-1 ring-primary-800/30"
    >
      {/* ── Full-bleed background image ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={offer.image || ""}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950/5 via-primary-900/90 to-primary-800/80" />

      <div className="relative flex flex-col sm:flex-row">
        {/* ── Ticket body ── */}
        <div className="relative flex-1 overflow-hidden p-4 md:p-6">
          <div className="relative flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-primary-500/30 bg-primary-800/60 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest-x text-primary-200 backdrop-blur-sm">
              <FaTag className="h-2.5 w-2.5 text-secondary" />
              Retail &amp; Wholesale
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-950/60 px-2.5 py-1 text-[10px] font-extrabold text-primary-200">
              <FaClock className="h-2.5 w-2.5 text-primary-400" />
              {cd.ready && cd.done ? "Expired" : "Ending soon"}
            </span>
          </div>

          <div className="relative mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <h3 className="text-lg font-extrabold leading-tight tracking-tight text-white md:text-xl">
              {offer.title}
            </h3>
            <p className="text-xs leading-5 text-primary-200">
              {offer.description}
            </p>
          </div>

          <div className="relative mt-3 flex flex-wrap items-center justify-center gap-2 text-center sm:justify-start sm:text-left">
            {cd.ready && !cd.done && (
              <div className="flex shrink-0 items-center gap-1.5 rounded-xl border border-secondary/40 bg-gradient-to-r from-secondary/20 via-secondary/10 to-transparent px-2.5 py-2 shadow-soft">
                <FaClock className="mr-0.5 h-3 w-3 shrink-0 text-secondary" />
                {[
                  ["Days", cd.days],
                  ["Hrs", cd.hours],
                  ["Min", cd.minutes],
                  ["Sec", cd.seconds],
                ].map(([label, val], i) => (
                  <div key={label as string} className="flex shrink-0 items-center gap-1.5">
                    <div className="flex min-w-[2.75rem] shrink-0 flex-col items-center rounded-lg bg-primary-950/80 px-2 py-1 ring-1 ring-secondary/30">
                      <span className="text-base font-extrabold leading-none tracking-tight text-secondary tabular-nums">
                        {String(val).padStart(2, "0")}
                      </span>
                      <span className="mt-0.5 text-[8px] font-bold uppercase tracking-widest-x text-primary-300">
                        {label}
                      </span>
                    </div>
                    {i < 3 && (
                      <span className="shrink-0 text-sm font-extrabold text-secondary/50">:</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {offer.code && (
              <div className="flex max-w-full items-center gap-2 rounded-xl border-2 border-dashed border-secondary bg-secondary/15 px-3 py-2 shadow-soft">
                <FaTicketAlt className="h-3.5 w-3.5 shrink-0 text-secondary" />
                <div className="min-w-0 leading-tight">
                  <div className="text-[8px] font-bold uppercase tracking-widest-x text-secondary/80">
                    Use code
                  </div>
                  <div className="break-all text-sm font-extrabold tracking-wider text-secondary">
                    {offer.code}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative mt-3 flex flex-wrap gap-1.5">
            <InfoPill Icon={FaStore} label="Retail" />
            <InfoPill Icon={FaBoxes} label="Wholesale" />
            <InfoPill Icon={FaTruckMoving} label="Fast despatch" />
          </div>
        </div>

        {/* ── Perforation ── */}
        <div className="relative shrink-0">
          <div className="pointer-events-none absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-white sm:left-0 sm:top-1/2 sm:h-6 sm:w-6 sm:-translate-x-1/2 sm:-translate-y-1/2" />
          <div className="pointer-events-none absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-white sm:bottom-0 sm:left-0 sm:top-auto sm:h-6 sm:w-6 sm:-translate-x-1/2 sm:translate-y-1/2" />
          <div className="mx-6 border-t-2 border-dashed border-primary-500/40 sm:mx-0 sm:my-6 sm:h-full sm:border-l-2 sm:border-t-0" />
          <FaCut className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-90 text-primary-400 sm:rotate-0" />
        </div>

        {/* ── Tear-off stub ── */}
        <div className="relative flex shrink-0 flex-col items-center justify-center gap-2.5 p-4 sm:w-40 sm:p-5 md:w-48">
          <span className="hidden text-[9px] font-black uppercase tracking-widest-x text-primary-400 sm:[writing-mode:vertical-rl]">
            Offer
          </span>

          {isExternal ? (
            <a
              href={primaryHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-primary-500 px-3.5 py-2 text-xs font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-primary-400"
            >
              {primaryLabel}
              <FaArrowRight className="h-3 w-3" />
            </a>
          ) : (
            <Link
              href={primaryHref}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-primary-500 px-3.5 py-2 text-xs font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-primary-400"
            >
              {primaryLabel}
              <FaArrowRight className="h-3 w-3" />
            </Link>
          )}

          <a
            href={siteConfig.socials.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-primary-600/40 bg-primary-900/50 px-3.5 py-2 text-xs font-bold text-primary-100 backdrop-blur-sm transition hover:border-secondary hover:text-secondary"
          >
            <FaWhatsapp className="h-3.5 w-3.5" />
            WhatsApp
          </a>
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
    <div className="flex items-center gap-1 rounded-md border border-primary-700/40 bg-primary-900/40 px-2 py-1 text-[10px] font-bold text-primary-100 backdrop-blur-sm">
      <Icon className="h-2.5 w-2.5 text-secondary" />
      {label}
    </div>
  );
}
