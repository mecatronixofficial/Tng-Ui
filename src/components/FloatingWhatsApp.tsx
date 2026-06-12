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
    <div className="fixed bottom-5 right-5 z-40 flex items-end gap-3">
      <AnimatePresence>
        {tooltipOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="relative hidden max-w-[300px] overflow-hidden rounded-lg border border-secondary/30 bg-white shadow-warm sm:block"
          >
            <button
              type="button"
              onClick={() => setTooltipOpen(false)}
              aria-label="Dismiss"
              className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-md text-primary-800 transition hover:bg-primary-50"
            >
              <FaTimes className="h-3 w-3" />
            </button>
            <div className="bg-primary-900 px-4 py-3 pr-10 text-white">
              <div className="text-[10px] font-bold uppercase tracking-widest-x text-secondary-light">
                Cloth enquiry
              </div>
              <div className="mt-1 text-sm font-extrabold leading-5">
                Retail and wholesale support on WhatsApp
              </div>
            </div>
            <div className="grid gap-2 p-3">
              <div className="flex items-center gap-2 rounded-md bg-primary-50 px-3 py-2 text-xs font-bold text-primary-950">
                <FaStore className="h-3.5 w-3.5 text-primary-600" />
                Single piece and family shopping
              </div>
              <div className="flex items-center gap-2 rounded-md bg-secondary/10 px-3 py-2 text-xs font-bold text-primary-950">
                <FaBoxes className="h-3.5 w-3.5 text-secondary-dark" />
                Bulk orders for shops and traders
              </div>
            </div>
            <div className="absolute -right-1.5 bottom-6 h-3 w-3 rotate-45 border-b border-r border-secondary/30 bg-white" />
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href={buildWhatsAppEnquiryUrl()}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex items-center gap-2 rounded-full border border-secondary/30 bg-primary-900 p-1.5 pr-3 text-white shadow-warm transition hover:bg-primary-800"
      >
        <span className="absolute inset-0 rounded-full bg-secondary opacity-30 animate-ping" />
        <span className="relative grid h-12 w-12 place-items-center rounded-full bg-secondary text-white transition group-hover:scale-105">
          <FaWhatsapp className="h-6 w-6" />
        </span>
        <span className="relative hidden pr-1 text-left sm:block">
          <span className="block text-[10px] font-bold uppercase tracking-widest-x text-secondary-light">
            WhatsApp
          </span>
          <span className="block text-xs font-extrabold">Ask cloth details</span>
        </span>
      </a>
    </div>
  );
}
