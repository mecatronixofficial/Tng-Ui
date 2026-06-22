"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaWhatsapp,
} from "react-icons/fa";

import type { Product } from "@/types";
import { useWishlist } from "@/store";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=900&auto=format&fit=crop&q=85";

export default function ProductCard({ product }: { product: Product }) {
  const has = useWishlist((s) => s.has(product.id));
  const toggle = useWishlist((s) => s.toggle);
  const [activeImage, setActiveImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const galleryImages = useMemo(() => {
    const images = product.images.filter(Boolean).slice(0, 5);
    return images.length > 0 ? images : [FALLBACK_IMAGE];
  }, [product.images]);
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
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-[#faf8f5] shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.14)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setActiveImage(0); }}
    >
      <div className="relative aspect-square overflow-hidden bg-primary-100">
        <Link href={`/products/${product.slug}`} className="absolute inset-0 z-0" aria-label={product.name}>
          <span className="sr-only">{product.name}</span>
        </Link>

        {galleryImages.map((src, index) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={`${product.id}-${src}-${index}`}
            src={src}
            alt={index === 0 ? product.name : ""}
            loading={index === 0 ? "eager" : "lazy"}
            className={[
              "pointer-events-none absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out",
              index === activeImage ? "opacity-100" : "opacity-0",
              isHovered ? "scale-[1.06]" : "scale-100",
            ].join(" ")}
          />
        ))}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <div className="absolute left-0 top-3 z-10 flex flex-col gap-0">
          {product.newArrival && (
            <span className="bg-secondary px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-primary-950">
              New
            </span>
          )}
          {discount >= 10 && (
            <span className="bg-rose-500 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-white">
              −{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-primary-950/90 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white/90">
              Sold out
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); toggle(product.id); }}
          aria-label={has ? "Remove from wishlist" : "Save"}
          className={[
            "absolute right-2.5 top-2.5 z-10 grid h-7 w-7 place-items-center rounded-full transition-all duration-200 active:scale-90",
            has
              ? "bg-rose-500 text-white shadow-lg shadow-rose-500/40"
              : "bg-white/80 text-primary-800 shadow-md backdrop-blur-sm hover:bg-white hover:text-rose-500",
          ].join(" ")}
        >
          {has ? <FaHeart className="h-3 w-3" /> : <FaRegHeart className="h-3 w-3" />}
        </button>

        {imageCount > 1 && (
          <div className="absolute bottom-10 left-2.5 z-10 flex items-center gap-1">
            {galleryImages.map((_, i) => (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setActiveImage(i)}
                aria-label={`Image ${i + 1}`}
                className={[
                  "rounded-full transition-all duration-200",
                  i === activeImage
                    ? "h-2 w-5 bg-white shadow-md"
                    : "h-2 w-2 bg-white/50 hover:bg-white/75",
                ].join(" ")}
              />
            ))}
          </div>
        )}

        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-x-0 bottom-0 z-10 flex translate-y-full items-center justify-center gap-2 bg-primary-950 py-2.5 text-[11px] font-black uppercase tracking-widest text-white transition-transform duration-300 ease-out group-hover:translate-y-0 hover:bg-primary-800"
        >
          Shop Now <FaArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-secondary-dark">
            {product.category}
          </span>
          <span className="flex items-center gap-0.5 text-[10px] font-bold text-primary-700">
            <FaStar className="h-2 w-2 text-secondary" />
            {product.rating}
          </span>
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1 line-clamp-1 text-[13px] font-extrabold leading-snug tracking-tight text-primary-950 transition-colors hover:text-primary-600">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1.5 flex items-baseline gap-1.5">
          {product.offerPrice ? (
            <>
              <span className="text-base font-black leading-none text-primary-900">
                ₹{product.offerPrice.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && product.originalPrice !== product.offerPrice && (
                <span className="text-[10px] text-ink-muted line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
              {discount >= 10 && (
                <span className="rounded bg-rose-50 px-1 py-0.5 text-[9px] font-black text-rose-500">
                  −{discount}%
                </span>
              )}
            </>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">Price on request</span>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          {product.colors.length > 0 ? (
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 5).map((c, i) => (
                <span
                  key={i}
                  title={c}
                  className={`${colorSwatch(c)} h-3 w-3 rounded-full ring-1 ring-black/10 ring-offset-1 ring-offset-[#faf8f5]`}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-[9px] font-semibold text-ink-muted">+{product.colors.length - 5}</span>
              )}
            </div>
          ) : <span />}
          <span className="shrink-0 text-[9px] font-semibold uppercase tracking-wide text-ink-muted">
            {product.material}
          </span>
        </div>

        <div className="mt-2.5 grid grid-cols-2 gap-1.5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1 rounded-lg bg-[#25D366] py-2 text-[11px] font-black text-white shadow-sm shadow-[#25D366]/30 transition-all duration-200 hover:bg-[#1ebe5d] active:scale-95"
          >
            <FaWhatsapp className="h-3 w-3" />
            Enquire
          </a>
          <Link
            href={`/products/${product.slug}`}
            className="flex items-center justify-center gap-1 rounded-lg border-2 border-primary-950 py-2 text-[11px] font-black text-primary-950 transition-all duration-200 hover:bg-primary-950 hover:text-white active:scale-95"
          >
            View
            <FaArrowRight className="h-2.5 w-2.5" />
          </Link>
        </div>
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
