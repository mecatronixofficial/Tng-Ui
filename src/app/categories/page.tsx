import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowRight, FaBoxes, FaStore, FaTags, FaWhatsapp } from "react-icons/fa";

import PageHero from "@/components/PageHero";
import SectionTitle from "@/components/SectionTitle";
import { loadCategories } from "@/lib/data";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Categories",
  description: `${siteConfig.name} retail and wholesale cloth categories including petticoats, lungis, towels, gamcha, bed sheets, dhotis and handloom products.`,
};

export default async function CategoriesPage() {
  const categories = await loadCategories();

  return (
    <>
      <PageHero
        eyebrow="Cloth categories"
        title="Retail and wholesale cloth range."
        subtitle="Browse practical textile categories for home shopping, shop stock, repeat trade and bulk supply."
        bgImage="https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=1920&auto=format&fit=crop&q=80"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Categories" }]}
      />

      <section className="section-y bg-cream-50">
        <div className="container-x">
          <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <SectionTitle
              eyebrow="Shop by cloth type"
              title="Categories made for retail counters and wholesale cartons."
              description="Choose a category, compare available products, and message us for single-piece retail needs or bulk wholesale supply."
            />
            <a
              href={siteConfig.socials.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-secondary-dark"
            >
              <FaWhatsapp className="h-4 w-4" />
              Ask on WhatsApp
            </a>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group overflow-hidden rounded-lg border border-primary-100 bg-white shadow-soft transition hover:-translate-y-1 hover:border-secondary hover:shadow-warm"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-primary-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 rounded-lg bg-secondary px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x text-white shadow-soft">
                    {cat.productCount} items
                  </div>
                  <div className="absolute right-4 top-4 rounded-lg bg-secondary/90 px-3 py-2 text-[10px] font-bold uppercase tracking-widest-x text-white">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>

                <div className="p-5">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-primary-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-800">
                      <FaStore className="h-3 w-3 text-secondary" />
                      Retail
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-secondary-dark">
                      <FaBoxes className="h-3 w-3" />
                      Wholesale
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold leading-tight text-primary-950 group-hover:text-primary-700">
                    {cat.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-muted">
                    {cat.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-primary-100 pt-4">
                    <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
                      <FaTags className="h-3 w-3 text-secondary" />
                      Cloth category
                    </span>
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-secondary">
                      Explore <FaArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
