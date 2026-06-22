// components/WhatsAppButton.tsx
"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton({ url }: { url: string }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        window.open(url, "_blank", "noreferrer");
      }}
      className="flex w-full items-center gap-3 rounded-lg border border-primary-100 p-2 text-ink transition hover:border-primary-300"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#25D366]/10 text-[#128C7E]">
        <FaWhatsapp className="h-4 w-4" />
      </span>
      <span className="min-w-0 text-left">
        <span className="block truncate text-sm font-bold">
          Ask cloth details
        </span>
        <span className="mt-0.5 block truncate text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
          Retail + Wholesale
        </span>
      </span>
    </button>
  );
}