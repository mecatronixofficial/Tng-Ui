"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaArrowRight,
  FaBoxes,
  FaShoppingCart,
  FaStore,
  FaTags,
  FaTrash,
  FaWhatsapp,
} from "react-icons/fa";

import PageHero from "@/components/PageHero";
import CartEnquiryModal from "@/components/CartEnquiryModal";
import { siteConfig } from "@/data/site";
import { useCart, type CartItem } from "@/store";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=300&auto=format&fit=crop&q=85";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const clear = useCart((s) => s.clear);
  const [showEnquiry, setShowEnquiry] = useState(false);

  const totalUnits = items.reduce((sum, i) => sum + i.quantity, 0);
  const banner = "/banners/cart-shopping.png"
  return (
    <>
      <PageHero
        eyebrow="Enquiry cart"
        title="Build your enquiry before you message us."
        subtitle="Add retail pieces or wholesale bundles from as many products as you need, then send it all as one enquiry."
        bgImage={banner}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]}
      />

      <section className="section-y bg-cream-50">
        <div className="container-x">
          {items.length === 0 ? (
            <div className="mx-auto max-w-2xl rounded-lg border border-primary-100 bg-white p-8 text-center shadow-warm md:p-12">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-lg bg-primary-50 text-secondary">
                <FaShoppingCart className="h-8 w-8" />
              </div>
              <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-secondary/10 px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x text-secondary-dark">
                <FaTags className="h-3 w-3" />
                Your cart is empty
              </div>
              <h2 className="mt-4 text-3xl font-extrabold text-primary-950">
                Add a few products to send one enquiry
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink-muted">
                Browse the catalogue and tap "Add to Cart" on any product — choose
                colours, sizes and retail or wholesale quantities, then message us
                once for everything.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-secondary-dark"
                >
                  Browse Cloths <FaArrowRight className="h-3.5 w-3.5" />
                </Link>
                <a
                  href={siteConfig.socials.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-secondary/30 bg-white px-6 py-3 text-sm font-bold text-secondary transition hover:bg-secondary hover:text-white"
                >
                  <FaWhatsapp className="h-4 w-4" />
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartRow
                    key={item.key}
                    item={item}
                    onRemove={() => remove(item.key)}
                    onQuantity={(q) => updateQuantity(item.key, q)}
                  />
                ))}
              </div>

              <div className="space-y-4 rounded-lg border border-primary-100 bg-white p-5 shadow-soft lg:sticky lg:top-24">
                <div className="inline-flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
                  <FaShoppingCart className="h-3 w-3 text-secondary" />
                  {items.length} {items.length === 1 ? "product" : "products"} ·{" "}
                  {totalUnits} unit{totalUnits > 1 ? "s" : ""}
                </div>
                <p className="text-sm leading-6 text-ink-muted">
                  Review your selection, then send it all as one enquiry to our
                  team on WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={() => setShowEnquiry(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-secondary-dark"
                >
                  <FaWhatsapp className="h-4 w-4" />
                  Send Enquiry
                </button>
                <button
                  type="button"
                  onClick={clear}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary-200 bg-white px-5 py-3 text-xs font-bold uppercase tracking-wide text-primary-800 transition hover:border-secondary hover:text-secondary"
                >
                  <FaTrash className="h-3 w-3" />
                  Clear cart
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <CartEnquiryModal
        open={showEnquiry}
        onClose={() => setShowEnquiry(false)}
        items={items}
        onSubmitted={clear}
      />
    </>
  );
}

function CartRow({
  item,
  onRemove,
  onQuantity,
}: {
  item: CartItem;
  onRemove: () => void;
  onQuantity: (quantity: number) => void;
}) {
  const totalPieces =
    item.mode === "wholesale" ? item.quantity * (item.bundleSize || 12) : item.quantity;

  return (
    <div className="flex gap-4 rounded-lg border border-primary-100 bg-white p-4 shadow-soft">
      <Link
        href={`/products/${item.slug}`}
        className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-primary-50"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image || FALLBACK_IMAGE}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/products/${item.slug}`}
            className="line-clamp-2 text-sm font-bold text-primary-950 hover:text-secondary"
          >
            {item.name}
          </Link>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove"
            className="shrink-0 text-primary-400 transition hover:text-secondary"
          >
            <FaTrash className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
          {item.color && <span>Color: {item.color}</span>}
          {item.size && <span>Size: {item.size}</span>}
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 font-bold text-primary-800">
            {item.mode === "wholesale" ? (
              <FaBoxes className="h-2.5 w-2.5" />
            ) : (
              <FaStore className="h-2.5 w-2.5" />
            )}
            {item.mode === "wholesale" ? "Wholesale" : "Retail"}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center rounded-lg border border-primary-100 bg-primary-50">
            <button
              type="button"
              onClick={() => onQuantity(Math.max(1, item.quantity - 1))}
              className="grid h-8 w-8 place-items-center text-ink-soft hover:text-secondary"
              aria-label="Decrease"
            >
              −
            </button>
            <span className="px-3 text-sm font-extrabold text-primary-950">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantity(item.quantity + 1)}
              className="grid h-8 w-8 place-items-center text-ink-soft hover:text-secondary"
              aria-label="Increase"
            >
              +
            </button>
          </div>
          <span className="text-xs text-ink-muted">
            {item.mode === "wholesale"
              ? `${item.quantity} bundle${item.quantity > 1 ? "s" : ""} (${totalPieces} pcs)`
              : `${item.quantity} piece${item.quantity > 1 ? "s" : ""}`}
          </span>
        </div>
      </div>
    </div>
  );
}
