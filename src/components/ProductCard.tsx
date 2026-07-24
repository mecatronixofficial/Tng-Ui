"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiHeart, FiStar } from "react-icons/fi";
import { FaCartPlus, FaCheck, FaHeart, FaWhatsapp } from "react-icons/fa";

import type { Product } from "@/types";
import { useCart, useWishlist } from "@/store";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";
import OrderEnquiryModal from "@/components/OrderEnquiryModal";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=900&auto=format&fit=crop&q=85";

export default function ProductCard({ product }: { product: Product }) {
  const has = useWishlist((s) => s.has(product.id));
  const toggle = useWishlist((s) => s.toggle);
  const addToCart = useCart((s) => s.add);
  const [activeImage, setActiveImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [added, setAdded] = useState(false);

  const galleryImages = useMemo(() => {
    const images = product.images.filter(Boolean).slice(0, 5);
    return images.length > 0 ? images : [FALLBACK_IMAGE];
  }, [product.images]);
  const imageCount = galleryImages.length;

  useEffect(() => {
    setActiveImage(0);
  }, [product.id, imageCount]);

  const whatsappUrl = buildWhatsAppOrderUrl({
    productName: product.name,
    productLink: `https://thangaveltextile.com/products/${product.slug}`,
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: galleryImages[0],
      color: product.colors[0],
      size: product.sizes[0],
      mode: "retail",
      quantity: 1,
      bundleSize: product.bundleSize,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_-18px_rgba(0,0,0,0.45)]"
      onMouseEnter={() => {
        setIsHovered(true);
        if (imageCount > 1) setActiveImage(1);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveImage(0);
      }}
    >
      <div className="relative aspect-square overflow-hidden bg-stone-900">
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

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/25" />

        <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
          {product.newArrival && (
            <span className="rounded-full bg-amber-500 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-stone-900">
              New
            </span>
          )}
          {product.stock === 0 && (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-stone-900">
              Sold out
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); toggle(product.id); }}
          aria-label={has ? "Remove from wishlist" : "Save"}
          className={[
            "absolute right-3 top-3 z-10 grid h-9 w-9 touch-manipulation place-items-center rounded-full backdrop-blur-md transition-all duration-200 active:scale-90",
            has
              ? "bg-rose-500 text-white shadow-lg shadow-rose-500/40"
              : "border border-white/30 bg-white/10 text-white hover:bg-white/20",
          ].join(" ")}
        >
          {has ? <FaHeart className="h-3.5 w-3.5" /> : <FiHeart className="h-3.5 w-3.5" />}
        </button>

        {imageCount > 1 && (
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
            {galleryImages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); setActiveImage(i); }}
                onMouseEnter={() => setActiveImage(i)}
                aria-label={`Image ${i + 1}`}
                className="touch-manipulation p-1"
              >
                <span
                  className={[
                    "block rounded-full transition-all duration-200",
                    i === activeImage
                      ? "h-1.5 w-5 bg-white"
                      : "h-1.5 w-1.5 bg-white/50 hover:bg-white/75",
                  ].join(" ")}
                />
              </button>
            ))}
          </div>
        )}

        <Link
          href={`/products/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-stone-900 opacity-100 shadow-md transition-all duration-300 ease-out sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-hover:bg-amber-500 sm:group-hover:text-white"
        >
          <FiArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-stone-400">
            {product.category}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-stone-600">
            <FiStar className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
            {product.rating}
          </span>
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1 line-clamp-1 text-[13px] font-semibold leading-snug tracking-tight text-stone-900 transition-colors hover:text-amber-600">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center justify-between gap-2">
          {product.colors.length > 0 ? (
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 5).map((c, i) => (
                <span
                  key={i}
                  title={c}
                  className={`${colorSwatch(c)} h-3 w-3 rounded-full ring-1 ring-stone-200 ring-offset-1 ring-offset-white`}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-[9px] font-semibold text-stone-400">+{product.colors.length - 5}</span>
              )}
            </div>
          ) : <span />}
          <span className="shrink-0 text-[9px] font-medium uppercase tracking-wide text-stone-400">
            {product.material}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-[2.25rem_1fr_1fr] gap-1.5">
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label="Add to cart"
            title="Add to cart"
            className={[
              "flex touch-manipulation items-center justify-center rounded-xl py-2.5 transition-all duration-200 active:scale-95",
              added
                ? "bg-emerald-500 text-white"
                : "border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white",
            ].join(" ")}
          >
            {added ? <FaCheck className="h-3 w-3" /> : <FaCartPlus className="h-3 w-3" />}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setShowEnquiry(true);
            }}
            className="flex touch-manipulation items-center justify-center gap-1.5 rounded-xl bg-[#25D366] py-2.5 text-[11px] font-semibold text-white transition-all duration-200 hover:bg-[#1ebe5d] active:scale-95"
          >
            <FaWhatsapp className="h-3 w-3" />
            Enquire
          </button>
        </div>
      </div>

      <OrderEnquiryModal
        open={showEnquiry}
        onClose={() => setShowEnquiry(false)}
        whatsappUrl={whatsappUrl}
        productName={product.name}
        productSlug={product.slug}
        quantity={1}
        quantityLabel="1 piece – Retail"
        source="product_enquiry"
      />
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
