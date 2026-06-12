"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaArrowRight,
  FaBoxes,
  FaHeart,
  FaStore,
  FaTags,
  FaTrash,
  FaWhatsapp,
} from "react-icons/fa";

import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";
import { siteConfig } from "@/data/site";
import { api, type ProductApi } from "@/lib/api";
import { useWishlist } from "@/store";
import type { Product } from "@/types";

export default function WishlistPage() {
  const items = useWishlist((s) => s.items);
  const clear = useWishlist((s) => s.clear);
  const [allProducts, setAllProducts] = useState<ProductApi[]>([]);

  useEffect(() => {
    api.publicProducts().then((res) => setAllProducts(res.data)).catch(() => {});
  }, []);

  const saved = allProducts.filter((p) => items.includes(p.id)) as unknown as Product[];
  const message = encodeURIComponent(
    `Hello, I have shortlisted ${saved.length} cloth product(s). Please share retail/wholesale availability.`,
  );

  return (
    <>
      <PageHero
        eyebrow="Cloth shortlist"
        title="Saved retail and wholesale cloths."
        subtitle="Keep products here while comparing retail needs, shop stock, colours, sizes and wholesale quantities."
        bgImage="https://images.unsplash.com/photo-1583846552345-d2ce05fbe1c5?w=1920&auto=format&fit=crop&q=80"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Wishlist" }]}
      />

      <section className="border-b border-primary-100 bg-white">
        <div className="container-x grid gap-3 py-6 md:grid-cols-3">
          {[
            { label: "Retail shortlist", Icon: FaStore },
            { label: "Wholesale planning", Icon: FaBoxes },
            { label: "Saved cloth products", Icon: FaHeart },
          ].map(({ label, Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-lg border border-primary-100 bg-primary-50 p-4"
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-white">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-sm font-extrabold text-primary-950">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-y bg-cream-50">
        <div className="container-x">
          {saved.length === 0 ? (
            <div className="mx-auto max-w-2xl rounded-lg border border-primary-100 bg-white p-8 text-center shadow-warm md:p-12">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-lg bg-primary-50 text-secondary">
                <FaHeart className="h-8 w-8" />
              </div>
              <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-secondary/10 px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x text-secondary-dark">
                <FaTags className="h-3 w-3" />
                No cloths saved yet
              </div>
              <h2 className="mt-4 text-3xl font-extrabold text-primary-950">
                Build your retail or wholesale shortlist
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink-muted">
                Browse our catalogue and tap the heart icon on any cloth product
                to compare it later or ask for availability.
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
            <>
              <div className="mb-8 grid gap-5 rounded-lg border border-primary-100 bg-white p-5 shadow-soft lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
                    <FaHeart className="h-3 w-3 text-secondary" />
                    {saved.length} {saved.length === 1 ? "cloth item" : "cloth items"} saved
                  </div>
                  <h2 className="mt-3 text-2xl font-extrabold text-primary-950">
                    Ready to ask or compare products?
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    Use this shortlist for retail shopping, family purchases,
                    shop stock planning or wholesale enquiry.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <a
                    href={`https://wa.me/${siteConfig.whatsapp}?text=${message}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-secondary-dark"
                  >
                    <FaWhatsapp className="h-4 w-4" />
                    Ask on WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={clear}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-200 bg-white px-5 py-3 text-xs font-bold uppercase tracking-wide text-primary-800 transition hover:border-secondary hover:text-secondary"
                  >
                    <FaTrash className="h-3 w-3" />
                    Clear all
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 md:gap-7 lg:grid-cols-4">
                {saved.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
