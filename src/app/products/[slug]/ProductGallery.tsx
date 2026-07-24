"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=1200&auto=format&fit=crop&q=85";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const galleryImages = images.length > 0 ? images : [FALLBACK_IMAGE];
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-primary-100 bg-white p-3 shadow-soft sm:grid sm:grid-cols-5">
      {/* Main */}
      <div className="relative order-1 aspect-[4/5] overflow-hidden rounded-lg bg-primary-50 sm:order-2 sm:col-span-4">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={galleryImages[active]}
            alt={name}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute left-4 top-4 rounded-lg bg-secondary/90 px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x text-white">
          Retail + Wholesale
        </div>
      </div>

      {/* Thumbs */}
      {galleryImages.length > 1 && (
        <div className="no-scrollbar order-2 flex gap-3 overflow-x-auto sm:order-1 sm:col-span-1 sm:flex-col sm:overflow-visible">
          {galleryImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg border-2 transition sm:w-auto",
                i === active
                  ? "border-secondary opacity-100"
                  : "border-primary-100 opacity-70 hover:border-primary-400 hover:opacity-100"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
