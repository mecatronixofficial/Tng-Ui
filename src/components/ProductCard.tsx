"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaWhatsapp, FaStar } from "react-icons/fa";

import type { Product } from "@/types";
import { useWishlist } from "@/store";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";

export default function ProductCard({ product }: { product: Product }) {
  const has = useWishlist((s) => s.has(product.id));
  const toggle = useWishlist((s) => s.toggle);
  const [activeImage, setActiveImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const galleryImages = useMemo(
    () => product.images.filter(Boolean).slice(0, 5),
    [product.images],
  );
  const imageCount = galleryImages.length;

  const whatsappUrl = buildWhatsAppOrderUrl({
    productName: product.name,
    productLink: `https://thangaveltextile.in/products/${product.slug}`,
  });

  const discount =
    product.originalPrice && product.offerPrice && product.originalPrice > product.offerPrice
      ? Math.round(((product.originalPrice - product.offerPrice) / product.originalPrice) * 100)
      : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.06] transition-shadow duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setActiveImage(0); }}
    >
      {/* ── Image ────────────────────────────────────────────── */}
      <div className="relative aspect-[3/4] overflow-hidden bg-primary-50">
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-0 z-0"
          aria-label={product.name}
        >
          <span className="sr-only">{product.name}</span>
        </Link>

        {(imageCount > 0 ? galleryImages : [""]).map((src, index) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={`${product.id}-${src || "fallback"}-${index}`}
            src={src}
            alt={index === 0 ? product.name : ""}
            loading={index === 0 ? "eager" : "lazy"}
            className={[
              "pointer-events-none absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out",
              index === activeImage ? "opacity-100" : "opacity-0",
              isHovered ? "scale-[1.04]" : "scale-100",
            ].join(" ")}
          />
        ))}

        {/* Subtle bottom gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {product.newArrival && (
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow">
              New
            </span>
          )}
          {discount >= 10 && (
            <span className="rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow">
              -{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white/90 backdrop-blur-sm">
              Sold out
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); toggle(product.id); }}
          aria-label={has ? "Remove from wishlist" : "Save"}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/85 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white"
        >
          {has
            ? <FaHeart className="h-4 w-4 text-rose-500" />
            : <FaRegHeart className="h-4 w-4 text-gray-600" />}
        </button>
      </div>

      {/* ── Thumbnail strip ──────────────────────────────────── */}
      {imageCount > 1 && (
        <div className="flex gap-1.5 border-t border-black/[0.05] bg-gray-50/70 px-3 py-2">
          {galleryImages.map((src, index) => (
            <button
              key={`${product.id}-thumb-${index}`}
              type="button"
              onMouseEnter={() => setActiveImage(index)}
              className={[
                "relative h-12 flex-1 overflow-hidden rounded-lg transition-all duration-200",
                index === activeImage
                  ? "ring-2 ring-primary-600 ring-offset-1 opacity-100"
                  : "ring-1 ring-black/10 opacity-60 hover:opacity-90",
              ].join(" ")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* ── Info ─────────────────────────────────────────────── */}
      <div className="flex flex-col px-4 pb-4 pt-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
            {product.category}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-bold text-secondary">
            <FaStar className="h-2.5 w-2.5" />
            {product.rating}
          </span>
        </div>

        <h3 className="mt-1 line-clamp-2 text-sm font-extrabold leading-snug text-primary-950 transition-colors group-hover:text-primary-700">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center justify-between gap-2">
          {product.offerPrice ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-primary-700">
                ₹{product.offerPrice}
              </span>
              {product.originalPrice && product.originalPrice !== product.offerPrice && (
                <span className="text-xs font-medium text-ink-muted line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
          ) : null}

          {product.colors.length > 0 && (
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 4).map((c, i) => (
                <span
                  key={i}
                  title={c}
                  className={`${colorSwatch(c)} h-3 w-3 rounded-full ring-1 ring-black/10`}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-ink-muted">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>

        {/* WhatsApp CTA — slides in on hover */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-3 flex w-full translate-y-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 text-sm font-bold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-[#1ebe5d]"
        >
          <FaWhatsapp className="h-4 w-4" />
          Enquire on WhatsApp
        </a>
      </div>
    </motion.article>
  );
}

function colorSwatch(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("white") || n.includes("cream") || n.includes("off")) return "bg-[#f5e9d4]";
  if (n.includes("maroon")) return "bg-[#7d2b2b]";
  if (n.includes("red")) return "bg-[#c0392b]";
  if (n.includes("black")) return "bg-[#1a1410]";
  if (n.includes("navy") || n.includes("indigo")) return "bg-[#1e3a8a]";
  if (n.includes("blue")) return "bg-[#2563eb]";
  if (n.includes("sea green")) return "bg-[#2dd4bf]";
  if (n.includes("green") || n.includes("bottle")) return "bg-[#15803d]";
  if (n.includes("yellow") || n.includes("mustard")) return "bg-[#eab308]";
  if (n.includes("orange")) return "bg-[#ea580c]";
  if (n.includes("pink")) return "bg-[#ec4899]";
  if (n.includes("beige") || n.includes("skin")) return "bg-[#e8dab7]";
  if (n.includes("brown")) return "bg-[#92400e]";
  return "bg-[#9ca3af]";
}
