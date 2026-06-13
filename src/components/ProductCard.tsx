"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaWhatsapp, FaStar } from "react-icons/fa";

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

  const galleryImages = useMemo(
    () => {
      const images = product.images.filter(Boolean).slice(0, 5);
      return images.length > 0 ? images : [FALLBACK_IMAGE];
    },
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
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-primary-100 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-warm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setActiveImage(0); }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-primary-50">
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-0 z-0"
          aria-label={product.name}
        >
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
              "pointer-events-none absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out",
              index === activeImage ? "opacity-100" : "opacity-0",
              isHovered ? "scale-[1.04]" : "scale-100",
            ].join(" ")}
          />
        ))}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-primary-950/45 via-primary-950/10 to-transparent" />

        <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
          {product.newArrival && (
            <span className="rounded-md bg-secondary px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow">
              New
            </span>
          )}
          {discount >= 10 && (
            <span className="rounded-md bg-rose-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow">
              -{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="rounded-md bg-primary-950/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white/90 backdrop-blur-sm">
              Sold out
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); toggle(product.id); }}
          aria-label={has ? "Remove from wishlist" : "Save"}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-md bg-white/90 text-primary-900 shadow-md backdrop-blur-sm transition duration-200 hover:bg-white hover:text-rose-500"
        >
          {has
            ? <FaHeart className="h-4 w-4 text-rose-500" />
            : <FaRegHeart className="h-4 w-4" />}
        </button>

        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-2 text-white">
          <span className="rounded-md bg-white/90 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary-900 shadow-sm backdrop-blur-sm">
            {product.category}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-primary-950/75 px-2.5 py-1.5 text-[11px] font-bold backdrop-blur-sm">
            <FaStar className="h-2.5 w-2.5 text-secondary-light" />
            {product.rating}
          </span>
        </div>
      </div>

      {imageCount > 1 && (
        <div className="flex gap-1.5 border-b border-primary-100 bg-primary-50 px-3 py-2">
          {galleryImages.map((src, index) => (
            <button
              key={`${product.id}-thumb-${index}`}
              type="button"
              onMouseEnter={() => setActiveImage(index)}
              className={[
                "relative h-11 flex-1 overflow-hidden rounded-md transition duration-200",
                index === activeImage
                  ? "opacity-100 ring-2 ring-secondary ring-offset-1"
                  : "opacity-60 ring-1 ring-primary-100 hover:opacity-90",
              ].join(" ")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.slug}`} className="group/title">
          <h3 className="line-clamp-2 min-h-[2.75rem] text-[15px] font-extrabold leading-snug text-primary-950 transition-colors group-hover/title:text-primary-700">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3 flex items-start justify-between gap-3">
          {product.offerPrice ? (
            <div className="min-w-0">
              <span className="block text-lg font-black leading-none text-primary-700">
                ₹{product.offerPrice}
              </span>
              {product.originalPrice && product.originalPrice !== product.offerPrice && (
                <span className="mt-1 block text-xs font-medium text-ink-muted line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
          ) : (
            <div className="text-xs font-bold uppercase tracking-wide text-ink-muted">
              Price on request
            </div>
          )}

          {product.colors.length > 0 && (
            <div className="flex shrink-0 items-center gap-1 pt-0.5">
              {product.colors.slice(0, 4).map((c, i) => (
                <span
                  key={i}
                  title={c}
                  className={`${colorSwatch(c)} h-3.5 w-3.5 rounded-full ring-1 ring-black/10`}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-ink-muted">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-primary-100 pt-3 text-[11px] font-bold uppercase tracking-wide text-ink-muted">
          <span>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
          {(product.wholesaleEnabled ?? true) && (
            <span className="text-primary-700">Wholesale</span>
          )}
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] py-2.5 text-sm font-bold text-white transition hover:bg-[#1ebe5d]"
        >
          <FaWhatsapp className="h-4 w-4" />
          Enquire
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
