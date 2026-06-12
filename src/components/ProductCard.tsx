"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaBoxes,
  FaHeart,
  FaRegHeart,
  FaStore,
  FaTruckMoving,
  FaWhatsapp,
  FaStar,
} from "react-icons/fa";

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

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="group relative h-full overflow-hidden rounded-lg border border-primary-100 bg-white shadow-soft transition hover:-translate-y-1 hover:border-secondary hover:shadow-warm"
    >
      {/* Full-card link overlay — sits below interactive elements */}
      <Link
        href={`/products/${product.slug}`}
        className="absolute inset-0 z-0"
        aria-label={product.name}
      />

      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-primary-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images[0] ?? ""}
          alt={product.name}
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Hover image */}
        {product.images[1] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[1]}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {product.newArrival && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest-x text-primary-800 shadow-soft">
              <FaStar className="h-3 w-3 text-secondary" />
              New
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-white/95 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-primary-900">
            <FaStore className="h-3 w-3 text-primary-600" />
            Retail
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-primary-900/90 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white">
            <FaBoxes className="h-3 w-3 text-primary-300" />
            Wholesale
          </span>
        </div>

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 grid place-items-center bg-cream-50/85 z-10">
            <span className="text-primary-800 uppercase tracking-widest-x text-xs font-bold">
              Out of stock
            </span>
          </div>
        )}

        {/* Wishlist — z-10 so it sits above the card link overlay */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggle(product.id);
          }}
          aria-label={has ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-lg bg-white/95 text-primary-800 shadow-soft backdrop-blur transition hover:bg-primary-600 hover:text-white"
        >
          {has ? (
            <FaHeart className="h-3.5 w-3.5 text-secondary" />
          ) : (
            <FaRegHeart className="h-3.5 w-3.5" />
          )}
        </button>

        {/* WhatsApp CTA — slides up on hover, z-10 so it sits above the card link */}
        <div className="absolute left-0 right-0 top-1/2 z-10 px-3 opacity-0 transition duration-300 group-hover:-translate-y-1/2 group-hover:opacity-100">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-3 text-xs font-bold text-white shadow-warm transition hover:bg-secondary-dark"
          >
            <FaWhatsapp className="h-4 w-4" /> Enquire
          </a>
        </div>
      </div>

      {/* Info */}
      <div className="relative z-10 p-4 pointer-events-none">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
          <span className="rounded-md bg-primary-50 px-2 py-1">
            {product.category}
          </span>
          <span className="flex items-center gap-1">
            <FaStar className="h-2.5 w-2.5 text-secondary" />
            {product.rating} ({product.reviews})
          </span>
        </div>

        <h3 className="mt-3 text-lg font-extrabold leading-tight text-primary-950 transition group-hover:text-primary-700 md:text-xl">
          {product.name}
        </h3>

        <div className="mt-3 flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 text-xs font-bold text-primary-950">
          <FaTruckMoving className="h-3.5 w-3.5 text-secondary" />
          <span>{product.stock > 0 ? `${product.stock} ready stock` : "Check availability"}</span>
        </div>

        {/* Color swatches */}
        {product.colors.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5">
            {product.colors.slice(0, 4).map((c, i) => (
              <span
                key={i}
                title={c}
                className={`${colorSwatch(c)} inline-block h-2.5 w-2.5 rounded-full border border-cream-300`}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-ink-muted">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}
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
  if (n.includes("sea green")) return "bg-[#2dd4bf]"; // must precede "green"
  if (n.includes("green") || n.includes("bottle")) return "bg-[#15803d]";
  if (n.includes("yellow") || n.includes("mustard")) return "bg-[#eab308]";
  if (n.includes("orange")) return "bg-[#ea580c]";
  if (n.includes("pink")) return "bg-[#ec4899]";
  if (n.includes("beige") || n.includes("skin")) return "bg-[#e8dab7]";
  if (n.includes("brown")) return "bg-[#92400e]";
  return "bg-[#9ca3af]";
}
