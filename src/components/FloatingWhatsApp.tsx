"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaBoxes, FaStore, FaTimes, FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { buildWhatsAppEnquiryUrl } from "@/lib/whatsapp";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTooltipOpen(true), 2500);
    const t2 = setTimeout(() => setTooltipOpen(false), 8000);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] right-4 z-40 flex items-end gap-3 sm:bottom-6 sm:right-6">
      {/* Popup card */}
      <AnimatePresence>
        {tooltipOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.92 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative hidden w-72 overflow-hidden rounded-2xl bg-white shadow-[0_8px_40px_-8px_rgba(0,0,0,0.18)] sm:block"
          >
            {/* Green header */}
            <div className="relative overflow-hidden bg-[#128C7E] px-4 pb-4 pt-4">
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10" />
              <div className="absolute -right-1 bottom-1 h-10 w-10 rounded-full bg-white/10" />
              <button
                type="button"
                onClick={() => setTooltipOpen(false)}
                aria-label="Dismiss"
                className="absolute right-2.5 top-2.5 grid h-6 w-6 place-items-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
              >
                <FaTimes className="h-2.5 w-2.5" />
              </button>
              <div className="flex items-center gap-3 pr-6">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/20">
                  <FaWhatsapp className="h-5 w-5 text-white" />
                </span>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                    Thangavel Textile
                  </div>
                  <div className="text-sm font-extrabold leading-tight text-white">
                    Retail &amp; wholesale support
                  </div>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="grid gap-2 p-3">
              <a
                href={buildWhatsAppEnquiryUrl()}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 px-3 py-2.5 transition hover:bg-green-100"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#25D366] text-white">
                  <FaStore className="h-3.5 w-3.5" />
                </span>
                <div>
                  <div className="text-xs font-extrabold text-gray-900">Retail order</div>
                  <div className="text-[10px] text-gray-500">Single piece, family shopping</div>
                </div>
              </a>
              <a
                href={buildWhatsAppEnquiryUrl()}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 px-3 py-2.5 transition hover:bg-green-100"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#128C7E] text-white">
                  <FaBoxes className="h-3.5 w-3.5" />
                </span>
                <div>
                  <div className="text-xs font-extrabold text-gray-900">Wholesale enquiry</div>
                  <div className="text-[10px] text-gray-500">Bulk orders for shops &amp; traders</div>
                </div>
              </a>
            </div>

            {/* Arrow pointing right */}
            <div className="absolute -right-1.5 bottom-8 h-3 w-3 rotate-45 border-b border-r border-gray-100 bg-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main WhatsApp button */}
      <motion.a
        href={buildWhatsAppEnquiryUrl()}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative grid h-[52px] w-[52px] place-items-center rounded-full bg-[#25D366] shadow-[0_8px_32px_-4px_rgba(37,211,102,0.55)] transition sm:h-16 sm:w-16"
        onClick={() => setTooltipOpen((v) => !v)}
      >
        {/* Ripple rings */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping [animation-duration:1.4s]" />
        <span className="absolute -inset-2 rounded-full border-2 border-[#25D366] opacity-20 animate-ping [animation-duration:1.9s]" />
        <FaWhatsapp className="relative h-6 w-6 text-white sm:h-8 sm:w-8" />
      </motion.a>
    </div>
  );
}
