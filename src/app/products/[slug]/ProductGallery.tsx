"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="grid grid-cols-5 gap-4 rounded-lg border border-primary-100 bg-white p-3 shadow-soft">
      {/* Thumbs */}
      <div className="col-span-1 flex flex-col gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "relative aspect-square overflow-hidden rounded-lg border-2 transition",
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

      {/* Main */}
      <div className="col-span-4 relative aspect-[4/5] overflow-hidden rounded-lg bg-primary-50">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={images[active]}
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
    </div>
  );
}
