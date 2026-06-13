import type { Metadata } from "next";
import { FaWhatsapp } from "react-icons/fa";

import CategoryCard from "@/components/CategoryCard";
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
              <CategoryCard
                key={cat.id}
                category={cat}
                href={`/categories/${cat.slug}`}
                index={i}
                rank={i + 1}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
