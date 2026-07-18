// components/WhatsAppButton.tsx
"use client";

import { FaArrowRight, FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton({ url }: { url: string }) {
  return (
    <button
      type="button"
      aria-label="Ask about cloth details on WhatsApp"
      onClick={(e) => {
        e.stopPropagation();
        window.open(url, "_blank", "noopener,noreferrer");
      }}
      className="group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-primary-700/70 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 p-3 text-white shadow-[0_12px_30px_-18px_rgba(45,5,5,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/60 hover:shadow-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 active:translate-y-0"
    >
      <span className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />
      <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-secondary/15 blur-2xl transition-colors duration-500 group-hover:bg-secondary/25" />

      <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary-950 shadow-[0_10px_24px_-12px_rgba(255,214,51,0.9)] transition-all duration-300 group-hover:rotate-[-4deg] group-hover:scale-105">
        <FaWhatsapp className="h-[18px] w-[18px]" />
      </span>

      <span className="relative min-w-0 flex-1 text-left">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm font-black tracking-tight">
            Ask cloth details
          </span>
          <span className="flex shrink-0 items-center gap-1 text-[8px] font-black uppercase tracking-wider text-secondary-light">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary-light" />
            Online
          </span>
        </span>
        <span className="mt-1 block truncate text-[9px] font-bold uppercase tracking-[0.16em] text-white/55">
          Retail &amp; wholesale assistance
        </span>
      </span>

      <span className="relative mr-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/15 bg-white/10 text-secondary-light transition-all duration-300 group-hover:translate-x-0.5 group-hover:border-secondary/40 group-hover:bg-secondary group-hover:text-primary-950">
        <FaArrowRight className="h-3 w-3" />
      </span>
    </button>
  );
}
