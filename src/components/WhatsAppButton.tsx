// components/WhatsAppButton.tsx
"use client";

import { FaBoxes, FaStore, FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton({ url }: { url: string }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        window.open(url, "_blank", "noreferrer");
      }}
      className="group flex w-full items-center justify-between gap-3 rounded-lg border border-secondary/30 bg-primary-900 p-2 text-white shadow-soft transition hover:bg-primary-800 hover:shadow-warm"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-white transition group-hover:scale-105">
          <FaWhatsapp className="h-5 w-5" />
        </span>
        <span className="min-w-0 text-left">
          <span className="block truncate text-sm font-extrabold">
            Ask cloth details
          </span>
          <span className="mt-0.5 block truncate text-[10px] font-bold uppercase tracking-widest-x text-secondary-light">
            Retail + Wholesale
          </span>
        </span>
      </span>
      <span className="hidden shrink-0 items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide sm:inline-flex">
        <FaStore className="h-3 w-3 text-primary-300" />
        <FaBoxes className="h-3 w-3 text-secondary-light" />
      </span>
    </button>
  );
}
