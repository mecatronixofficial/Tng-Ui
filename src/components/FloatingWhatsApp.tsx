"use client";

import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import { buildWhatsAppEnquiryUrl } from "@/lib/whatsapp";

export default function FloatingWhatsApp() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href={buildWhatsAppEnquiryUrl()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] right-4 z-40 grid h-[32px] w-[32px] place-items-center rounded-full bg-[#25D366] shadow-[0_8px_32px_-4px_rgba(37,211,102,0.55)] ring-4 ring-[#25D366]/20 transition hover:scale-105 hover:ring-[#25D366]/30 active:scale-95 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14 "
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping [animation-duration:2s]" />
      <FaWhatsapp className="relative h-6 w-6 text-white sm:h-8 sm:w-8" />
    </a>
  );
}
