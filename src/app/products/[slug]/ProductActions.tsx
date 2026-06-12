"use client";

import { useState } from "react";
import {
  FaBoxes,
  FaHeart,
  FaRegHeart,
  FaShareAlt,
  FaStore,
  FaWhatsapp,
} from "react-icons/fa";

import type { Product } from "@/types";
import { useWishlist } from "@/store";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";
import { cn } from "@/utils";

export default function ProductActions({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[0] || "");
  const [size, setSize] = useState(product.sizes[0] || "");
  const [qty, setQty] = useState(1);

  const has = useWishlist((s) => s.has(product.id));
  const toggle = useWishlist((s) => s.toggle);

  const whatsapp = buildWhatsAppOrderUrl({
    productName: product.name,
    color,
    size,
    quantity: qty,
    productLink: `https://thangaveltextile.in/products/${product.slug}`,
  });

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.description.slice(0, 100),
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch {
      // user cancelled
    }
  };

  return (
    <div className="space-y-6 rounded-lg border border-primary-100 bg-white p-5 shadow-soft">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-primary-50 p-3">
          <FaStore className="h-4 w-4 text-secondary" />
          <div className="mt-2 text-xs font-bold uppercase tracking-wide text-primary-800">
            Retail order
          </div>
        </div>
        <div className="rounded-lg bg-secondary/10 p-3">
          <FaBoxes className="h-4 w-4 text-secondary" />
          <div className="mt-2 text-xs font-bold uppercase tracking-wide text-primary-800">
            Wholesale enquiry
          </div>
        </div>
      </div>

      {/* Colors */}
      {product.colors.length > 0 && (
        <div>
          <div className="text-[10px] uppercase tracking-widest-x text-primary-800 font-bold mb-3">
            Color · <span className="text-ink-soft normal-case">{color}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={cn(
                  "rounded-lg border px-4 py-2 text-xs font-bold transition",
                  c === color
                    ? "border-secondary bg-secondary text-white"
                    : "border-primary-100 text-ink-soft hover:border-secondary hover:text-primary-800"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {product.sizes.length > 0 && (
        <div>
          <div className="text-[10px] uppercase tracking-widest-x text-primary-800 font-bold mb-3">
            Size · <span className="text-ink-soft normal-case">{size}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={cn(
                  "rounded-lg border px-4 py-2 text-xs font-bold transition min-w-[60px]",
                  s === size
                    ? "border-secondary bg-secondary text-white"
                    : "border-primary-100 text-ink-soft hover:border-secondary hover:text-primary-800"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <div className="text-[10px] uppercase tracking-widest-x text-primary-800 font-bold mb-3">
          Quantity · retail or bulk
        </div>
        <div className="inline-flex items-center rounded-lg border border-primary-100 bg-primary-50">
          <button
            type="button"
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="h-11 w-11 grid place-items-center text-ink-soft hover:text-secondary"
            aria-label="Decrease"
          >
            −
          </button>
          <span className="px-5 font-extrabold text-primary-950">{qty}</span>
          <button
            type="button"
            onClick={() => setQty(qty + 1)}
            className="h-11 w-11 grid place-items-center text-ink-soft hover:text-secondary"
            aria-label="Increase"
          >
            +
          </button>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3 border-t border-primary-100 pt-5">
        <a
          href={whatsapp}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-w-[220px] flex-1 items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-secondary-dark"
        >
          <FaWhatsapp className="h-4 w-4" /> Ask on WhatsApp
        </a>
        <button
          type="button"
          onClick={() => toggle(product.id)}
          className="grid h-12 w-12 place-items-center rounded-lg border border-primary-200 bg-white text-primary-800 transition hover:border-secondary hover:text-secondary"
          aria-label="Wishlist"
        >
          {has ? <FaHeart className="h-4 w-4" /> : <FaRegHeart className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={share}
          className="grid h-12 w-12 place-items-center rounded-lg border border-primary-200 bg-white text-primary-800 transition hover:border-secondary hover:text-secondary"
          aria-label="Share"
        >
          <FaShareAlt className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
