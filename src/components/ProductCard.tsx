"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaWhatsapp, FaStar } from "react-icons/fa";

import type { Product } from "@/types";
import { useWishlist } from "@/store";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";

export default function ProductCard({ product }: { product: Product }) {
  const has = useWishlist((s) => s.has(product.id));
  const toggle = useWishlist((s) => s.toggle);

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
      className="group relative flex flex-col"
    >
      {/* ── Image shell ─────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-primary-50 aspect-[3/4]">

        {/* Card link */}
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-0 z-0"
          aria-label={product.name}
        ><span className="sr-only">{product.name}</span></Link>

        {/* Images */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images[0] ?? ""}
          alt={product.name}
          loading="eager"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
        />
        {product.images[1] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[1]}
            alt=""
            loading="lazy"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        {/* Vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/5" />

        {/* ── Top-left badges ── */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {product.newArrival && (
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
              New
            </span>
          )}
          {discount >= 10 && (
            <span className="rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
              -{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white/90 backdrop-blur-sm">
              Sold out
            </span>
          )}
        </div>

        {/* ── Wishlist ── */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); toggle(product.id); }}
          aria-label={has ? "Remove from wishlist" : "Save"}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/80 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white"
        >
          {has
            ? <FaHeart className="h-4 w-4 text-rose-500" />
            : <FaRegHeart className="h-4 w-4 text-gray-600" />}
        </button>

        {/* ── Price pill (bottom-left) — fades out on hover ── */}
        <div className="absolute bottom-3 left-3 z-10 transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-1">
          {product.offerPrice ? (
            <div className="flex items-baseline gap-1.5 rounded-full bg-black/55 px-3 py-1.5 backdrop-blur-sm">
              <span className="text-sm font-black text-white">₹{product.offerPrice}</span>
              {product.originalPrice && product.originalPrice !== product.offerPrice && (
                <span className="text-[11px] font-medium text-white/55 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
          ) : null}
        </div>

        {/* ── WhatsApp CTA — slides up on hover ── */}
        <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex w-full items-center justify-center gap-2 bg-[#25D366] py-3 text-sm font-black text-white transition-colors hover:bg-[#1ebe5d]"
          >
            <FaWhatsapp className="h-4 w-4" />
            Enquire on WhatsApp
          </a>
        </div>
      </div>

      {/* ── Info ────────────────────────────────────────────── */}
      <Link href={`/products/${product.slug}`} className="mt-3 px-1">
        {/* Category + rating */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted">
            {product.category}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-bold text-secondary">
            <FaStar className="h-2.5 w-2.5" />
            {product.rating}
          </span>
        </div>

        {/* Name */}
        <h3 className="mt-1 line-clamp-2 text-sm font-extrabold leading-snug text-primary-950 transition group-hover:text-primary-600">
          {product.name}
        </h3>

        {/* Price row (below image) — shows on mobile or always */}
        <div className="mt-1.5 flex items-center justify-between gap-2">
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

          {/* Color dots */}
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
      </Link>
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
