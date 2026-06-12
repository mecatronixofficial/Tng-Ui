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

type Mode = "retail" | "wholesale";

const MIXED_COLOR = "Mixed / Assorted Colors";
const MIXED_SIZE = "Mixed / Assorted Sizes";

export default function ProductActions({ product }: { product: Product }) {
  const bundleSize = product.bundleSize ?? 12;

  const [mode, setMode] = useState<Mode>("retail");
  const [color, setColor] = useState(product.colors[0] || "");
  const [size, setSize] = useState(product.sizes[0] || "");
  const [qty, setQty] = useState(1);
  const [bundles, setBundles] = useState(1);

  const has = useWishlist((s) => s.has(product.id));
  const toggle = useWishlist((s) => s.toggle);

  const totalPieces = bundles * bundleSize;

  const whatsapp = buildWhatsAppOrderUrl({
    productName: product.name,
    color,
    size,
    quantity:
      mode === "wholesale"
        ? `${bundles} bundle${bundles > 1 ? "s" : ""} (${totalPieces} pieces) – Wholesale`
        : `${qty} piece${qty > 1 ? "s" : ""} – Retail`,
    productLink: `https://thangaveltextile.in/products/${product.slug}`,
  });

  const switchMode = (next: Mode) => {
    setMode(next);
    setColor(product.colors[0] || "");
    setSize(product.sizes[0] || "");
    setQty(1);
    setBundles(1);
  };

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
    <div className="space-y-5 rounded-lg border border-primary-100 bg-white p-5 shadow-soft">
      {/* Mode toggle */}
      <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-primary-50 p-1.5">
        <button
          type="button"
          onClick={() => switchMode("retail")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs font-bold uppercase tracking-wide transition",
            mode === "retail"
              ? "bg-white shadow text-primary-900 border border-primary-100"
              : "text-ink-muted hover:text-primary-800"
          )}
        >
          <FaStore className={cn("h-3.5 w-3.5", mode === "retail" ? "text-secondary" : "text-ink-muted")} />
          Retail
        </button>
        <button
          type="button"
          onClick={() => switchMode("wholesale")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs font-bold uppercase tracking-wide transition",
            mode === "wholesale"
              ? "bg-white shadow text-primary-900 border border-primary-100"
              : "text-ink-muted hover:text-primary-800"
          )}
        >
          <FaBoxes className={cn("h-3.5 w-3.5", mode === "wholesale" ? "text-secondary" : "text-ink-muted")} />
          Wholesale
        </button>
      </div>

      {/* Wholesale info banner */}
      {mode === "wholesale" && (
        <div className="flex items-center gap-2 rounded-lg bg-secondary/10 px-4 py-3 text-xs font-semibold text-secondary-dark">
          <FaBoxes className="h-3.5 w-3.5 shrink-0" />
          1 bundle = {bundleSize} pieces &nbsp;·&nbsp; Choose bundles below
        </div>
      )}

      {/* Colors */}
      {product.colors.length > 0 && (
        <div>
          <div className="mb-3 text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
            Color&nbsp;·&nbsp;<span className="normal-case font-normal text-ink-soft">{color}</span>
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
            {mode === "wholesale" && (
              <button
                type="button"
                onClick={() => setColor(MIXED_COLOR)}
                className={cn(
                  "rounded-lg border px-4 py-2 text-xs font-bold transition",
                  color === MIXED_COLOR
                    ? "border-secondary bg-secondary text-white"
                    : "border-dashed border-secondary/60 text-secondary hover:border-secondary hover:bg-secondary/5"
                )}
              >
                Mixed Colors
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sizes */}
      {product.sizes.length > 0 && (
        <div>
          <div className="mb-3 text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
            Size&nbsp;·&nbsp;<span className="normal-case font-normal text-ink-soft">{size}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={cn(
                  "min-w-[60px] rounded-lg border px-4 py-2 text-xs font-bold transition",
                  s === size
                    ? "border-secondary bg-secondary text-white"
                    : "border-primary-100 text-ink-soft hover:border-secondary hover:text-primary-800"
                )}
              >
                {s}
              </button>
            ))}
            {mode === "wholesale" && (
              <button
                type="button"
                onClick={() => setSize(MIXED_SIZE)}
                className={cn(
                  "min-w-[60px] rounded-lg border px-4 py-2 text-xs font-bold transition",
                  size === MIXED_SIZE
                    ? "border-secondary bg-secondary text-white"
                    : "border-dashed border-secondary/60 text-secondary hover:border-secondary hover:bg-secondary/5"
                )}
              >
                Mixed Sizes
              </button>
            )}
          </div>
        </div>
      )}

      {/* Retail quantity */}
      {mode === "retail" && (
        <div>
          <div className="mb-3 text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
            Quantity
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center rounded-lg border border-primary-100 bg-primary-50">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="grid h-11 w-11 place-items-center text-ink-soft hover:text-secondary"
                aria-label="Decrease"
              >
                −
              </button>
              <span className="px-5 font-extrabold text-primary-950">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className="grid h-11 w-11 place-items-center text-ink-soft hover:text-secondary"
                aria-label="Increase"
              >
                +
              </button>
            </div>
            <span className="text-xs text-ink-muted">
              {qty} piece{qty > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}

      {/* Wholesale bundle quantity */}
      {mode === "wholesale" && (
        <div>
          <div className="mb-3 text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
            Bundles
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center rounded-lg border border-primary-100 bg-primary-50">
              <button
                type="button"
                onClick={() => setBundles(Math.max(1, bundles - 1))}
                className="grid h-11 w-11 place-items-center text-ink-soft hover:text-secondary"
                aria-label="Decrease"
              >
                −
              </button>
              <span className="px-5 font-extrabold text-primary-950">{bundles}</span>
              <button
                type="button"
                onClick={() => setBundles(bundles + 1)}
                className="grid h-11 w-11 place-items-center text-ink-soft hover:text-secondary"
                aria-label="Increase"
              >
                +
              </button>
            </div>
            <div className="rounded-lg bg-secondary/10 px-3 py-2 text-xs font-bold text-secondary-dark">
              = {totalPieces} pieces
            </div>
          </div>
          <p className="mt-2 text-xs text-ink-muted">
            {bundles} bundle{bundles > 1 ? "s" : ""} × {bundleSize} pcs = {totalPieces} pieces total
          </p>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-wrap gap-3 border-t border-primary-100 pt-5">
        <a
          href={whatsapp}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-w-[200px] flex-1 items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-secondary-dark"
        >
          <FaWhatsapp className="h-4 w-4" />
          {mode === "wholesale" ? "Enquire Wholesale" : "Ask on WhatsApp"}
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
